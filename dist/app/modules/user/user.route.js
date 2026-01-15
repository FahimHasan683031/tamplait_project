"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const fileUploadHandler_1 = __importDefault(require("../../middleware/fileUploadHandler"));
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)(user_1.USER_ROLES.Business, user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getProfile);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getAllUser);
router.patch('/profile', (0, auth_1.default)(user_1.USER_ROLES.Business, user_1.USER_ROLES.ADMIN), (0, fileUploadHandler_1.default)(), user_controller_1.UserController.updateProfile);
// delete my account
router.delete('/me', (0, auth_1.default)(user_1.USER_ROLES.Business, user_1.USER_ROLES.ADMIN), user_controller_1.UserController.deleteMyAccount);
// get single user
router.get('/:id', user_controller_1.UserController.getSingleUser);
// delete user
router.delete('/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
