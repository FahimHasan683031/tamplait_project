"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubscriptionCreated = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../app/modules/user/user.model");
const subscription_model_1 = require("../app/modules/subscription/subscription.model");
const plan_model_1 = require("../app/modules/plan/plan.model");
const stripe_1 = __importDefault(require("../config/stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const emailHelper_1 = require("../helpers/emailHelper");
const emailTemplate_1 = require("../shared/emailTemplate");
const handleSubscriptionCreated = async (data) => {
    var _a, _b;
    try {
        // 🔹 Step 1: Retrieve the full subscription with expanded data
        const subscriptionResponse = await stripe_1.default.subscriptions.retrieve(data.id, {
            expand: ['latest_invoice.payment_intent'],
        });
        const subscription = subscriptionResponse;
        // 🔹 Step 2: Retrieve customer
        const customerResponse = await stripe_1.default.customers.retrieve(subscription.customer);
        const customer = customerResponse;
        // 🔹 Step 3: Extract necessary info
        const productId = (_b = (_a = subscription.items.data[0]) === null || _a === void 0 ? void 0 : _a.price) === null || _b === void 0 ? void 0 : _b.product;
        // Use a custom type that includes payment_intent
        const invoice = subscription.latest_invoice;
        const invoicePdf = invoice === null || invoice === void 0 ? void 0 : invoice.invoice_pdf;
        // Get transaction ID from invoice or generate one
        let trxId = null;
        if (invoice === null || invoice === void 0 ? void 0 : invoice.payment_intent) {
            const paymentIntent = typeof invoice.payment_intent === 'string'
                ? await stripe_1.default.paymentIntents.retrieve(invoice.payment_intent)
                : invoice.payment_intent;
            trxId = paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.id;
        }
        else if (invoice === null || invoice === void 0 ? void 0 : invoice.id) {
            trxId = invoice.id; // Use invoice ID as fallback
        }
        else {
            trxId = `sub_${subscription.id}_${Date.now()}`; // Generate a fallback ID
        }
        const amountPaid = ((invoice === null || invoice === void 0 ? void 0 : invoice.total) || 0) / 100;
        // 🔹 Step 4: Match user by email
        const user = await user_model_1.User.findOne({ email: customer.email });
        if (!user)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        // 🔹 Step 5: Match plan by Stripe productId
        const plan = await plan_model_1.Plan.findOne({ productId });
        if (!plan)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
        // 🔹 Step 6: Period dates
        const currentPeriodStart = subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : new Date();
        const currentPeriodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days if missing
        // 🔹 Step 7: Save subscription info in DB
        const subscriptionData = {
            customerId: customer.id,
            price: amountPaid,
            user: user._id,
            plan: plan._id,
            trxId,
            subscriptionId: subscription.id,
            status: 'active',
            invoice: invoicePdf,
            currentPeriodStart,
            currentPeriodEnd,
        };
        console.log('subscriptionData', subscriptionData);
        await subscription_model_1.Subscription.create(subscriptionData);
        // 🔹 Step 8: Update user subscription status
        await user_model_1.User.findByIdAndUpdate(user._id, { subscribe: true });
        await emailHelper_1.emailHelper.sendEmail(emailTemplate_1.emailTemplate.subscriptionActivatedEmail({
            user,
            plan,
            amountPaid,
            trxId,
            invoicePdf: invoicePdf || '',
        }));
    }
    catch (error) {
        console.error('Error in handleSubscriptionCreated:', error);
        return error;
    }
};
exports.handleSubscriptionCreated = handleSubscriptionCreated;
