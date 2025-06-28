import { Request, Response, NextFunction } from 'express';
import { MediaService } from './media.service';
import sendResponse from '../../../shared/sendResponse';

const createMedia = async (req: Request, res: Response, next: NextFunction) => {
    const result = await MediaService.createMediaInDB(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Media created successfully',
        data: result
    })
};

const retrievedMedia = async (req: Request, res: Response, next: NextFunction) => {
    const result = await MediaService.retrieveMediaFromDB(req.params.id, req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Media retrieved successfully',
        data: result
    })
};

export const MediaController = { createMedia, retrievedMedia };