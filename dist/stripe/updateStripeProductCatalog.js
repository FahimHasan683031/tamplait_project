"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStripeProductCatalog = void 0;
const http_status_codes_1 = require("http-status-codes");
const stripe_1 = __importDefault(require("../config/stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const config_1 = __importDefault(require("../config"));
const updateStripeProductCatalog = async (productId, payload) => {
    let interval = 'month';
    let intervalCount = 1;
    // map duration to interval_count
    switch (payload.duration) {
        case '1 month':
            interval = 'month';
            intervalCount = 1;
            break;
        case '3 months':
            interval = 'month';
            intervalCount = 3;
            break;
        case '6 months':
            interval = 'month';
            intervalCount = 6;
            break;
        case '1 year':
            interval = 'year';
            intervalCount = 1;
            break;
        default:
            interval = 'month';
            intervalCount = 1;
    }
    // Create a new price for the existing product
    const price = await stripe_1.default.prices.create({
        product: productId,
        unit_amount: payload.price && payload.price * 100,
        currency: 'gbp',
        recurring: { interval, interval_count: intervalCount },
    });
    // if failed to create new price
    if (!price) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create new price in Stripe");
    }
    // retrieved current prices;
    const oldPrices = await stripe_1.default.prices.list({ product: productId, active: true });
    // deactivate current prices
    for (const oldPrice of oldPrices.data) {
        await stripe_1.default.prices.update(oldPrice.id, { active: false });
    }
    // Create a new payment link
    const paymentLink = await stripe_1.default.paymentLinks.create({
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        after_completion: {
            type: 'redirect',
            redirect: {
                url: `${config_1.default.stripe.frontendUrl}/payments/success`, // Fixed from config.stripe.paymentSuccess
            },
        },
        metadata: {
            productId: productId,
        },
    });
    // if failed to create payment link
    if (!paymentLink.url) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create new payment link");
    }
    return paymentLink.url;
};
exports.updateStripeProductCatalog = updateStripeProductCatalog;
