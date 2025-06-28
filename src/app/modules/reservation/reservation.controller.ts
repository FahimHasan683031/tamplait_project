import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReservationService } from "./reservation.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createReservation = catchAsync(async (req: Request, res: Response) => {
    const reservation = await ReservationService.createReservationToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Submitted successfully",
        data: reservation
    })
}); 


const reservations = catchAsync(async (req: Request, res: Response) => {
    const reservation = await ReservationService.reservationsFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation retrieved successfully",
        data: reservation
    })
}); 

const reservationDetails = catchAsync(async (req: Request, res: Response) => {

    const reservation = await ReservationService.reservationDetailsFromDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Details retrieved successfully",
        data: reservation
    })
}); 

const approvedReservation = catchAsync(async (req: Request, res: Response) => {

    const reservation = await ReservationService.approvedReservationInDB(req.params.id, req.query.status as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Updated successfully",
        data: reservation
    })
});

const cancelReservation = catchAsync(async (req: Request, res: Response) => {

    const reservation = await ReservationService.cancelReservationInDB(req.params.id, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Canceled successfully",
        data: reservation
    })
});

const reservationSummary = catchAsync(async (req: Request, res: Response) => {

    const reservation = await ReservationService.reservationSummerFromDB(req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Summery successfully",
        data: reservation
    })
});

const completeReservation = catchAsync(async (req: Request, res: Response) => {

    const reservation = await ReservationService.completeReservationInDB(req.body.id, req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reservation Completed successfully",
        data: reservation
    })
});

export const ReservationController = {
    createReservation,
    reservations,
    reservationDetails,
    approvedReservation,
    cancelReservation,
    reservationSummary,
    completeReservation
}