import express from 'express';
import { MediaController } from './media.controller';
import { mediaZodValidationSchema } from './media.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
import { getSingleFilePath } from '../../../shared/getFilePath';

const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.VENDOR),
        fileUploadHandler(),
        async (req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = { vendor: req.user.id, image, ...req.body }; // need to pass only album id
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to create media" });
            }
        },
        validateRequest(mediaZodValidationSchema),
        MediaController.createMedia
    );

router.get('/:id',
    auth(USER_ROLES.VENDOR, USER_ROLES.CUSTOMER),
    MediaController.retrievedMedia
)

export const MediaRoutes = router;
