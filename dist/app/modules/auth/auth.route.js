"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const user_1 = require("../../../enum/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_validation_1 = require("../user/user.validation");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const getFilePath_1 = require("../../../shared/getFilePath");
const router = express_1.default.Router();
router.post('/signup', (0, fileUploadHandler_1.default)(), async (req, res, next) => {
    try {
        const image = (0, getFilePath_1.getSingleFilePath)(req.files, "image");
        req.body = {
            image,
            ...req.body
        };
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Failed to upload User Image" });
    }
}, (0, validateRequest_1.default)(user_validation_1.UserValidations.userSignupSchema), auth_controller_1.AuthController.createUser);
router.post('/admin-login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), auth_controller_1.AuthController.adminLogin);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), auth_controller_1.AuthController.login);
router.post('/verify-account', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.verifyAccountZodSchema), auth_controller_1.AuthController.verifyAccount);
router.post('/custom-login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginZodSchema), auth_controller_1.AuthController.login);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.forgetPasswordZodSchema), auth_controller_1.AuthController.forgetPassword);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.resetPasswordZodSchema), auth_controller_1.AuthController.resetPassword);
router.post('/resend-otp', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.resendOtpZodSchema), auth_controller_1.AuthController.resendOtp);
router.post('/change-password', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.Business), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.changePasswordZodSchema), auth_controller_1.AuthController.changePassword);
router.delete('/delete-account', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.Business), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.deleteAccount), auth_controller_1.AuthController.deleteAccount);
router.post('/access-token', auth_controller_1.AuthController.getAccessToken);
router.post('/logout', auth_controller_1.AuthController.logOut);
exports.AuthRoutes = router;
