"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubscriptionExpired = exports.checkAndUpdateExpiredSubscriptions = void 0;
const user_model_1 = require("../user/user.model");
const subscription_model_1 = require("./subscription.model");
const checkAndUpdateExpiredSubscriptions = async () => {
    try {
        const now = new Date();
        const expiredSubscriptions = await subscription_model_1.Subscription.find({
            status: 'active',
            currentPeriodEnd: { $lt: now },
        });
        for (const subscription of expiredSubscriptions) {
            try {
                // Update subscription status to expired
                await subscription_model_1.Subscription.findByIdAndUpdate(subscription._id, {
                    status: 'expired',
                });
                const anotherSubscription = await subscription_model_1.Subscription.findOne({
                    user: subscription.user,
                    status: 'active',
                });
                if (!anotherSubscription) {
                    await user_model_1.User.findOneAndUpdate({ _id: subscription.user }, { subscribe: false });
                }
                console.log(`Updated expired subscription: ${subscription._id}`);
            }
            catch (error) {
                console.error(`Error updating subscription ${subscription._id}:`, error);
            }
        }
        console.log(`Processed ${expiredSubscriptions.length} expired subscriptions`);
    }
    catch (error) {
        console.error('Error in checkAndUpdateExpiredSubscriptions:', error);
        throw error;
    }
};
exports.checkAndUpdateExpiredSubscriptions = checkAndUpdateExpiredSubscriptions;
const isSubscriptionExpired = (currentPeriodEnd) => {
    return new Date(currentPeriodEnd) < new Date();
};
exports.isSubscriptionExpired = isSubscriptionExpired;
