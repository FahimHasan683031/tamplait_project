"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeProductCatalog = void 0;
const http_status_codes_1 = require("http-status-codes");
const stripe_1 = __importDefault(require("../config/stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const createStripeProductCatalog = async (payload) => {
    // Create Product in Stripe
    const product = await stripe_1.default.products.create({
        name: payload.title,
        description: payload.description,
    });
    // Determine interval based on duration
    let interval = "month";
    let intervalCount = 1;
    switch (payload.duration) {
        case "1 month":
            interval = "month";
            intervalCount = 1;
            break;
        case "3 months":
            interval = "month";
            intervalCount = 3;
            break;
        case "6 months":
            interval = "month";
            intervalCount = 6;
            break;
        case "1 year":
            interval = "year";
            intervalCount = 1;
            break;
    }
    // Create Price for the Product
    const price = await stripe_1.default.prices.create({
        product: product.id,
        unit_amount: Math.round(Number(payload.price) * 100),
        currency: "gbp",
        recurring: { interval, interval_count: intervalCount },
    });
    if (!price) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Stripe price");
    }
    return { productId: product.id, priceId: price.id };
};
exports.createStripeProductCatalog = createStripeProductCatalog;
