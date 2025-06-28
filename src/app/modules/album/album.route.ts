import express from 'express';
import { AlbumController } from './album.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { albumZodValidationSchema } from './album.validation';
import validateRequest from '../../middlewares/validateRequest';
import { getSingleFilePath } from '../../../shared/getFilePath';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';

const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.VENDOR),
        fileUploadHandler(),
        async (req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = { vendor: req.user.id, image, ...req.body };
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to create album" });
            }
        },
        validateRequest(albumZodValidationSchema),
        AlbumController.createAlbum
    )

router.get('/:id',
    auth(USER_ROLES.VENDOR, USER_ROLES.CUSTOMER),
    AlbumController.retrieveAlbum
)

export const AlbumRoutes = router;
