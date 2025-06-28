import { Request, Response, NextFunction } from 'express';
import { ChecklistService } from './checklist.service';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';

const createChecklist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ChecklistService.createChecklistToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Checklist created successfully',
        data: result
    });
});

const retrievedChecklist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ChecklistService.retrievedChecklistFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Checklist retrieved successfully',
        data: result
    });
});

const completeChecklist = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ChecklistService.completeChecklistToDB(req.body.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Checklist completed successfully',
        data: result
    });
});

export const ChecklistController = { 
    createChecklist,
    retrievedChecklist,
    completeChecklist
};