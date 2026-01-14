import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../../../../SendUBack/src/app/middleware/auth";
import { USER_ROLES } from "../../../../../SendUBack/src/enum/user";

const router = Router();



router.post(
    "/checkout-session/:shippingId",
    PaymentController.createCheckoutSession
)

router.get(
    "/",
    auth(USER_ROLES.ADMIN),
    PaymentController.getPaymentsController
)
router.get(
    "/:id",
    auth(USER_ROLES.ADMIN),
    PaymentController.getPaymentByIdController
)



export const PaymentRouts = router;