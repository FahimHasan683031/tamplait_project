import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { ReservationController } from "./reservation.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReservationZodValidationSchema } from "./reservation.validation";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.CUSTOMER),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {guest, ...restPayload} = req.body;
                req.body = {
                    ...restPayload,
                    customer: req.user.id,
                    guest: Number(guest)
                };
                next();

            } catch (error) {
                res.status(500).json({ message: "Failed to processed reservation" });
            }
        },
        validateRequest(ReservationZodValidationSchema),
        ReservationController.createReservation
    )
    .get(
        auth(USER_ROLES.VENDOR, USER_ROLES.CUSTOMER),
        ReservationController.reservations
    );

router.get("/summary",
    auth(USER_ROLES.VENDOR),
    ReservationController.reservationSummary
)

router.patch("/completed",
    auth(USER_ROLES.CUSTOMER),
    ReservationController.completeReservation
)

router.route("/:id")
    .get(
        auth(USER_ROLES.VENDOR, USER_ROLES.CUSTOMER),
        ReservationController.reservationDetails
    )
    .patch(
        auth(USER_ROLES.VENDOR),
        ReservationController.approvedReservation
    )
    .delete(
        auth(USER_ROLES.CUSTOMER),
        ReservationController.cancelReservation
    );


export const ReservationRoutes = router;