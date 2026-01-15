"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const http_status_codes_1 = require("http-status-codes");
const plan_model_1 = require("./plan.model");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const subscription_model_1 = require("../subscription/subscription.model");
const createStripeProductCatalog_1 = require("../../../stripe/createStripeProductCatalog");
const deleteStripeProductCatalog_1 = require("../../../stripe/deleteStripeProductCatalog");
const createCheckoutSession_1 = require("../../../stripe/createCheckoutSession");
// Create plan in DB
const createPlanToDB = async (payload) => {
    // Create Strike Product and Price
    const stripeData = await (0, createStripeProductCatalog_1.createStripeProductCatalog)(payload);
    if (stripeData) {
        payload.productId = stripeData.productId;
        payload.priceId = stripeData.priceId;
    }
    const result = await plan_model_1.Plan.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to created Package');
    }
    return result;
};
const creatSession = async (user, planId) => {
    const url = await (0, createCheckoutSession_1.createCheckoutSession)(user, planId);
    return { url };
};
// Update plan in DB
const updatePlanToDB = async (id, payload) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const existingPlan = await plan_model_1.Plan.findById(id);
    if (!existingPlan) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
    }
    // Note: Stripe product updates are limited, usually we just update the DB
    // or create a new price if the price changes.
    const result = await plan_model_1.Plan.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update plan in DB');
    }
    return result;
};
// Get plan from DB
const getPlanFromDB = async (paymentType) => {
    const query = {
        status: 'Active',
    };
    if (paymentType) {
        query.paymentType = paymentType;
    }
    const result = await plan_model_1.Plan.find(query);
    const activeSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'active',
    });
    const expiredSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'expired',
    });
    const failedSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'cancel',
    });
    return {
        plans: result,
        meta: {
            activeSubscriptions,
            expiredSubscriptions,
            failedSubscriptions,
        },
    };
};
// Get plan details from DB
const getPlanDetailsFromDB = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    return await plan_model_1.Plan.findById(id);
};
// Delete plan from DB
const deletePlanToDB = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const isExist = await plan_model_1.Plan.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
    }
    if (isExist.productId) {
        await (0, deleteStripeProductCatalog_1.deleteStripeProductCatalog)(isExist.productId);
    }
    const result = await plan_model_1.Plan.findByIdAndUpdate({ _id: id }, { status: 'Delete' }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to deleted Package');
    }
    return result;
};
exports.PackageService = {
    createPlanToDB,
    updatePlanToDB,
    getPlanFromDB,
    getPlanDetailsFromDB,
    deletePlanToDB,
    creatSession,
};
