"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleStripeWebhook_1 = __importDefault(require("../../stripe/handleStripeWebhook"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const review_route_1 = require("../modules/review/review.route");
const payment_route_1 = require("../modules/payment/payment.route");
const public_route_1 = require("../modules/public/public.route");
const token_route_1 = require("../modules/token/token.route");
const plan_route_1 = require("../modules/plan/plan.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const chat_routes_1 = require("../modules/chat/chat.routes");
const message_routes_1 = require("../modules/message/message.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const router = express_1.default.Router();
const apiRoutes = [
    { path: "/user", route: user_route_1.UserRoutes },
    { path: "/auth", route: auth_route_1.AuthRoutes },
    { path: "/category", route: category_route_1.CategoryRoutes },
    { path: "/review", route: review_route_1.ReviewRoutes },
    { path: "/payment", route: payment_route_1.PaymentRoutes },
    { path: "/public", route: public_route_1.PublicRoutes },
    { path: "/token", route: token_route_1.TokenRoutes },
    { path: "/plan", route: plan_route_1.PlanRoutes },
    { path: "/subscription", route: subscription_route_1.SubscriptionRoutes },
    { path: "/chat", route: chat_routes_1.ChatRoutes },
    { path: "/message", route: message_routes_1.MessageRoutes },
    { path: "/notification", route: notification_routes_1.NotificationRoutes },
];
router.post('/webhook', handleStripeWebhook_1.default);
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
