import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { NoteZodSchemaValidation } from './note.validation';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import { NoteController } from './note.controller';
const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.CUSTOMER),
        async (req, res, next) => {
            try {
                req.body = { ...req.body, customer: req.user.id };
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to processed Note');
            }
        },
        validateRequest(NoteZodSchemaValidation),
        NoteController.makeNote
    )
    .get(
        auth(USER_ROLES.CUSTOMER),
        NoteController.retrieveNotesFromDB
    );

router.route('/:id')
    .delete(
        auth(USER_ROLES.CUSTOMER),
        NoteController.deleteNote
    );

export const NoteRoutes = router;