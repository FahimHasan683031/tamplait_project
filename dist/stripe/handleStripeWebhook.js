"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const stripe_1 = __importDefault(require("../config/stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleSubscriptionCreated_1 = require("./handleSubscriptionCreated");
const logger_1 = require("../shared/logger");
const user_model_1 = require("../app/modules/user/user.model");
const subscription_model_1 = require("../app/modules/subscription/subscription.model");
const payment_model_1 = require("../app/modules/payment/payment.model");
const handleStripeWebhook = async (req, res) => {
    var _a, _b, _c;
    console.log('hit stripe webhook');
    const signature = req.headers['stripe-signature'];
    const webhookSecret = config_1.default.stripe.webhookSecret;
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Webhook verification failed: ${error}`);
    }
    const data = event.data.object;
    const eventType = event.type;
    try {
        switch (eventType) {
            case 'checkout.session.completed': {
                const session = data;
                logger_1.logger.info('✅ Checkout completed:', session.id);
                const mode = session.mode;
                if (mode === 'payment') {
                    // Handle one-time payment
                    await payment_model_1.Payment.create({
                        email: (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email,
                        amount: (session.amount_total || 0) / 100,
                        transactionId: session.payment_intent || session.id,
                        dateTime: new Date(),
                        customerName: (_b = session.customer_details) === null || _b === void 0 ? void 0 : _b.name,
                        referenceId: (_c = session.metadata) === null || _c === void 0 ? void 0 : _c.referenceId,
                    });
                }
                // ✅ AUTO-RENEW OFF for subscriptions
                if (session.subscription) {
                    await stripe_1.default.subscriptions.update(session.subscription, { cancel_at_period_end: true });
                }
                break;
            }
            case 'customer.subscription.created':
                await (0, handleSubscriptionCreated_1.handleSubscriptionCreated)(data);
                break;
            case 'customer.subscription.updated': {
                const subscription = data;
                if (subscription.cancel_at_period_end &&
                    subscription.status === 'active') {
                    logger_1.logger.info(`Subscription for user ${subscription.metadata.userId} will expire`);
                    await user_model_1.User.findByIdAndUpdate(subscription.metadata.userId, {
                        subscribe: false,
                    });
                    await subscription_model_1.Subscription.findOneAndUpdate({ user: subscription.metadata.userId }, { status: 'expired' });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const deletedSub = data;
                await user_model_1.User.findByIdAndUpdate(deletedSub.metadata.userId, {
                    subscribe: false,
                });
                await subscription_model_1.Subscription.findOneAndUpdate({ user: deletedSub.metadata.userId }, { status: 'expired' });
                break;
            }
            default:
                logger_1.logger.info(`⚠️ Unhandled event type: ${eventType}`);
        }
    }
    catch (error) {
        logger_1.logger.error('Webhook error:', error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `${error}`);
    }
    res.sendStatus(200);
};
exports.default = handleStripeWebhook;
