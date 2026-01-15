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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getAllUser = async (query) => {
    const userQueryBuilder = new QueryBuilder_1.default(user_model_1.User.find().select('-password -authentication'), query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const users = await userQueryBuilder.modelQuery.lean();
    const paginationInfo = await userQueryBuilder.getPaginationInfo();
    const totalUsers = await user_model_1.User.countDocuments();
    const staticData = { totalUsers };
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
    getAllUser,
    getSingleUser,
    deleteUser,
    getProfile,
    deleteMyAccount,
};
