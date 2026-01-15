"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSession = void 0;
const stripe_1 = __importDefault(require("../config/stripe"));
const config_1 = __importDefault(require("../config"));
const createPaymentSession = async (user, amount, referenceId) => {
    const session = await stripe_1.default.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Payment',
                        description: `Payment for reference: ${referenceId}`,
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
        mode: 'payment',
        success_url: `${config_1.default.stripe.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config_1.default.stripe.frontendUrl}/payment/cancel`,
        customer_email: user.email,
        metadata: {
            userId: user.id || user.authId,
            referenceId: referenceId
        },
    });
    return session.url;
};
exports.createPaymentSession = createPaymentSession;
