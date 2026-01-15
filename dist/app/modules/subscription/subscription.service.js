"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const subscription_model_1 = require("./subscription.model");
const stripe_1 = __importDefault(require("../../../config/stripe"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const subscriptionDetailsFromDB = async (user) => {
    const subscription = await subscription_model_1.Subscription.findOne({ vendor: user.id }).populate("plan", "title price duration ").lean();
    if (!subscription) {
        return {}; // Return empty object if no subscription found
    }
    const subscriptionFromStripe = await stripe_1.default.subscriptions.retrieve(subscription.subscriptionId);
    // Check subscription status and update database accordingly
    if ((subscriptionFromStripe === null || subscriptionFromStripe === void 0 ? void 0 : subscriptionFromStripe.status) !== "active") {
        await Promise.all([
            user_model_1.User.findByIdAndUpdate(user.id, { subscribe: false }, { new: true }),
            subscription_model_1.Subscription.findOneAndUpdate({ vendor: user.id }, { status: "expired" }, { new: true })
        ]);
    }
    return subscription;
};
const subscriptionsFromDB = async (query) => {
    const result = new QueryBuilder_1.default(subscription_model_1.Subscription.find(), query).paginate();
    const subscriptions = await result.modelQuery
        .populate([
        {
            path: "plan",
            select: "title price duration"
        },
        {
            path: "customerId",
            select: "name email profile"
        }
    ])
        .select("-createdAt -updatedAt -__v -customerId -subscriptionId")
        .lean();
    const pagination = await result.getPaginationInfo();
    return { subscriptions, pagination };
};
exports.SubscriptionService = {
    subscriptionDetailsFromDB,
    subscriptionsFromDB
};
