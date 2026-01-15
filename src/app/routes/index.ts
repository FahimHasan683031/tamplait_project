import express from 'express';
import handleStripeWebhook from '../../stripe/handleStripeWebhook';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { PublicRoutes } from '../modules/public/public.route';
import { TokenRoutes } from '../modules/token/token.route';
import { PlanRoutes } from '../modules/plan/plan.route';
import { SubscriptionRoutes } from '../modules/subscription/subscription.route';

const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/category", route: CategoryRoutes },
    { path: "/review", route: ReviewRoutes },
    { path: "/payment", route: PaymentRoutes },
    { path: "/public", route: PublicRoutes },
    { path: "/token", route: TokenRoutes },
    { path: "/plan", route: PlanRoutes },
    { path: "/subscription", route: SubscriptionRoutes },
]

router.post('/webhook', handleStripeWebhook);

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;
