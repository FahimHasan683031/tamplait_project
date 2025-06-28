import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.route('/')
    .post(
        auth(USER_ROLES.CUSTOMER),
        async(req, res, next) => {
            try {
                req.body = {
                    customer: req.user.id,
                    package: req.body.package
                };
                next();
            } catch (error) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to process Bookmark")
            }
        }, 
        BookmarkController.toggleBookmark
    )
    .get(
        auth(USER_ROLES.CUSTOMER),
        BookmarkController.getBookmark
    );

export const BookmarkRoutes = router;
