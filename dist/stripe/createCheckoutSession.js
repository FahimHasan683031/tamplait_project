"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("../config/stripe"));
const user_model_1 = require("../app/modules/user/user.model");
const plan_model_1 = require("../app/modules/plan/plan.model");
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const createCheckoutSession = async (userdata, planId) => {
    const { id: userId } = userdata; // Note: original used authId, but our JwtPayload seems to have id
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    const plan = await plan_model_1.Plan.findById(planId);
    if (!plan) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found!');
    }
    const session = await stripe_1.default.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: plan.priceId,
                quantity: 1,
            },
        ],
        customer_email: user.email,
        success_url: `${config_1.default.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_1.default.stripe.frontendUrl}/payments/cancel`,
        metadata: {
            planId: plan._id.toString(),
            userId: user._id.toString(),
        },
    });
    return session.url;
};
exports.createCheckoutSession = createCheckoutSession;
