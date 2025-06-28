import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { BannerController } from "./banner.controller";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { getSingleFilePath } from "../../../shared/getFilePath";
const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), 
        fileUploadHandler(),
        async(req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = {image};
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to upload Banner Image" });
            }
        },  
        BannerController.createBanner
    )
    .get(
        auth(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), 
        BannerController.getAllBanner
    );

router.route('/:id')
    .patch(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), 
        fileUploadHandler(), 
        async(req, res, next) => {
            try {
                const image = getSingleFilePath(req.files, "image");
                req.body = {image};
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to upload Banner Image" });
            }
        }, 
        BannerController.updateBanner
    )
    .delete(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), 
        BannerController.deleteBanner
    );


export const BannerRoutes = router;