import { Request, Response, NextFunction } from 'express';
import { NoteServices } from './note.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const makeNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoteServices.makeNote(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Note created successfully',
        data: result
    });
});

const retrieveNotesFromDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoteServices.retrieveNotesFromDB(req.user, req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notes retrieved successfully',
        data: result
    });
});

const deleteNote = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await NoteServices.deleteNote(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Note deleted successfully',
        data: result
    });
});


export const NoteController = { makeNote, retrieveNotesFromDB, deleteNote };