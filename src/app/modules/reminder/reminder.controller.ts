import { Request, Response, NextFunction } from 'express';
import { ReminderService } from './reminder.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createReminder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReminderService.createReminderToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reminder created successfully',
        data: result
    });
});

const retrievedReminderFromDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReminderService.retrievedReminderFromDB(req.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reminder retrieved successfully',
        data: result
    });
});

const updateReminder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReminderService.updateReminderInDB(req.user, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Reminder updated successfully',
        data: result
    });
});


export const ReminderController = { 
    createReminder,
    retrievedReminderFromDB,
    updateReminder
};