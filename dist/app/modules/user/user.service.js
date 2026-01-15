"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const user_1 = require("../../../enum/user");
const logger_1 = require("../../../shared/logger");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../../config"));
// create super admin
const createAdmin = async () => {
    const admin = {
        email: config_1.default.super_admin.email,
        firstName: 'Super',
        lastName: 'Admin',
        password: config_1.default.super_admin.password,
        role: user_1.USER_ROLES.ADMIN,
        status: user_1.USER_STATUS.ACTIVE,
        verified: true,
        authentication: {
            oneTimeCode: '',
            restrictionLeftAt: null,
            resetPassword: false,
            wrongLoginAttempts: 0,
            latestRequestAt: new Date(),
        },
    };
    const isAdminExist = await user_model_1.User.findOne({
        email: admin.email,
        status: { $nin: [user_1.USER_STATUS.DELETED] },
    });
    if (isAdminExist) {
        logger_1.logger.log('info', 'Admin account already exist, skipping creation.');
        return isAdminExist;
    }
    const result = await user_model_1.User.create([admin]);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }
    logger_1.logger.log('info', 'Admin account created successfully.');
    return result[0];
};
const getAllUser = async (query) => {
    const userQueryBuilder = new QueryBuilder_1.default(user_model_1.User.find().select('-password -authentication'), query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const users = await userQueryBuilder.modelQuery.lean();
    const paginationInfo = await userQueryBuilder.getPaginationInfo();
    const totalUsers = await user_model_1.User.countDocuments();
    const totalBusiness = await user_model_1.User.countDocuments({
        role: user_1.USER_ROLES.Business,
    });
    const staticData = { totalUsers, totalBusiness };
    return {
        users,
        staticData,
        meta: paginationInfo,
    };
};
const getSingleUser = async (id) => {
    const result = await user_model_1.User.findById(id).select('-password -authentication');
    return result;
};
// delete User
const deleteUser = async (id) => {
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.role === user_1.USER_ROLES.ADMIN) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Admin cannot be deleted');
    }
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
const updateProfile = async (user, payload) => {
    const isExistUser = await user_model_1.User.findById(user.authId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found or deleted.');
    }
    const updatedUser = await user_model_1.User.findOneAndUpdate({ _id: user.authId, status: { $ne: user_1.USER_STATUS.DELETED } }, payload, { new: true });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update profile');
    }
    return updatedUser;
};
const getProfile = async (user) => {
    const isExistUser = await user_model_1.User.findById(user.authId).lean().select('-password -authentication');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The requested profile not found or deleted.');
    }
    return isExistUser;
};
const deleteMyAccount = async (user) => {
    const isExistUser = await user_model_1.User.findById(user.authId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'The requested profile not found or deleted.');
    }
    await user_model_1.User.findByIdAndDelete(isExistUser._id);
    return 'Account deleted successfully';
};
exports.UserServices = {
    updateProfile,
    createAdmin,
    getAllUser,
    getSingleUser,
    deleteUser,
    getProfile,
    deleteMyAccount,
};
