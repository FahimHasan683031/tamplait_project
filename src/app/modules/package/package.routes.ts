import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
import validateRequest from "../../middlewares/validateRequest";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { packageZodValidationSchema } from "./package.validation";
import { getSingleFilePath } from "../../../shared/getFilePath";
const router = express.Router()

router.route("/")
    .post(
        auth(USER_ROLES.VENDOR),
        fileUploadHandler(),
        async (req, res, next) => {
            try {
                const { price, capacity, outdoor, indoor, ...otherPayload } = req.body;
                const image = getSingleFilePath(req.files, "image");

                req.body = {
                    image,
                    vendor: req.user.id,
                    price: Number(price),
                    capacity: Number(capacity),
                    outdoor: outdoor ? Number(outdoor) : undefined,
                    indoor: indoor ? Number(indoor) : undefined,
                    ...otherPayload
                };
                next();
            } catch (error) {
                res.status(400).json({ message: "Failed to upload Package Image" });
            }
        },
        validateRequest(packageZodValidationSchema),
        PackageController.createPackage
    )
    .get(
        auth(USER_ROLES.VENDOR),
        PackageController.vendorPackage
    )

router.get("/all",
    auth(USER_ROLES.CUSTOMER, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    PackageController.getPackages
)

router.get("/wedding",
    auth(USER_ROLES.CUSTOMER),
    PackageController.retrievedWeddingPackages
)

router.get("/popular",
    auth(USER_ROLES.CUSTOMER),
    PackageController.retrievedPopularPackages
)

router.get("/availability/:id",
    auth(USER_ROLES.CUSTOMER),
    PackageController.retrievedPackageAvailability
)

router.route("/:id")
    .get(auth(USER_ROLES.VENDOR, USER_ROLES.CUSTOMER), PackageController.packageDetails)
    .patch(auth(USER_ROLES.VENDOR), PackageController.updatePackage)
    .delete(auth(USER_ROLES.VENDOR), PackageController.deletePackage)

export const PackageRoutes = router;