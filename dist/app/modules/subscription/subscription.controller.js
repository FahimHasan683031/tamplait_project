"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const subscription_service_1 = require("./subscription.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const subscriptions = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.SubscriptionService.subscriptionsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Subscription List Retrieved Successfully",
        data: result
    });
});
const subscriptionDetails = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.SubscriptionService.subscriptionDetailsFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Subscription Details Retrieved Successfully",
        data: result
    });
});
exports.SubscriptionController = {
    subscriptions,
    subscriptionDetails
};
