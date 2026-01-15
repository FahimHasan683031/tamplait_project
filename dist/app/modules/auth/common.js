"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResponse = exports.AuthCommonServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_1 = require("../../../enum/user");
const user_model_1 = require("../user/user.model");
const auth_helper_1 = require("./auth.helper");
const crypto_1 = require("../../../utils/crypto");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const emailHelper_1 = require("../../../helpers/emailHelper");
const handleLoginLogic = async (payload, isUserExist) => {
    const { authentication, verified, status, password } = isUserExist;
    const { restrictionLeftAt, wrongLoginAttempts } = authentication;
    if (!verified) {
        //send otp to user
        const otp = (0, crypto_1.generateOtp)();
        const otpExpiresIn = new Date(Date.now() + 5 * 60 * 1000);
        const authentication = {
            email: payload.email,
            oneTimeCode: otp,
            expiresAt: otpExpiresIn,
            latestRequestAt: new Date(),
            authType: 'createAccount',
        };
        await user_model_1.User.findByIdAndUpdate(isUserExist._id, {
            $set: {
                authentication,
            },
        });
        const otpTemplate = emailTemplate_1.emailTemplate.createAccount({
            name: `${isUserExist.firstName} ${isUserExist.lastName}`,
            email: isUserExist.email,
            otp,
        });
        setTimeout(() => {
            emailHelper_1.emailHelper.sendEmail(otpTemplate);
        }, 0);
        return (0, exports.authResponse)(http_status_codes_1.StatusCodes.PROXY_AUTHENTICATION_REQUIRED, `An OTP has been sent to your ${payload.email}. Please verify.`);
    }
    if (status === user_1.USER_STATUS.DELETED) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'No account found with this email');
    }
    if (status === user_1.USER_STATUS.RESTRICTED) {
        if (restrictionLeftAt && new Date() < restrictionLeftAt) {
            const remainingMinutes = Math.ceil((restrictionLeftAt.getTime() - Date.now()) / 60000);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS, `You are restricted to login for ${remainingMinutes} minutes`);
        }
        // Handle restriction expiration
        await user_model_1.User.findByIdAndUpdate(isUserExist._id, {
            $set: {
                authentication: { restrictionLeftAt: null, wrongLoginAttempts: 0 },
                status: user_1.USER_STATUS.ACTIVE,
            },
        });
    }
    console.log(payload.password, password);
    const isPasswordMatched = await user_model_1.User.isPasswordMatched(payload.password, password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Incorrect password, please try again.');
    }
    // if (!isPasswordMatched) {
    //   isUserExist.authentication.wrongLoginAttempts = wrongLoginAttempts + 1
    //   if (isUserExist.authentication.wrongLoginAttempts >= 5) {
    //     isUserExist.status = USER_STATUS.RESTRICTED
    //     isUserExist.authentication.restrictionLeftAt = new Date(
    //       Date.now() + 10 * 60 * 1000,
    //     ) // restriction for 10 minutes
    //   }
    //   await User.findByIdAndUpdate(isUserExist._id, {
    //     $set: {
    //       status: isUserExist.status,
    //       authentication: {
    //         restrictionLeftAt: isUserExist.authentication.restrictionLeftAt,
    //         wrongLoginAttempts: isUserExist.authentication.wrongLoginAttempts,
    //       },
    //     },
    //   })
    //   throw new ApiError(
    //     StatusCodes.BAD_REQUEST,
    //     'Incorrect password, please try again.',
    //   )
    // }
    await user_model_1.User.findByIdAndUpdate(isUserExist._id, {
        $set: {
            deviceToken: payload.deviceToken,
            authentication: {
                restrictionLeftAt: null,
                wrongLoginAttempts: 0,
            },
        },
    }, { new: true });
    const tokens = auth_helper_1.AuthHelper.createToken(isUserExist._id, isUserExist.role, `${isUserExist.firstName} ${isUserExist.lastName}`, isUserExist.email);
    const userInfo = {
        id: isUserExist._id,
        role: isUserExist.role,
        name: `${isUserExist.firstName} ${isUserExist.lastName}`,
        email: isUserExist.email,
        image: isUserExist.image,
    };
    return (0, exports.authResponse)(http_status_codes_1.StatusCodes.OK, `Welcome back ${isUserExist.firstName} ${isUserExist.lastName}`, undefined, tokens.accessToken, tokens.refreshToken, undefined, userInfo);
};
exports.AuthCommonServices = {
    handleLoginLogic,
};
const authResponse = (status, message, role, accessToken, refreshToken, token, userInfo) => {
    return {
        status,
        message,
        ...(role && { role }),
        ...(accessToken && { accessToken }),
        ...(refreshToken && { refreshToken }),
        ...(token && { token }),
        ...(userInfo && { userInfo }),
    };
};
exports.authResponse = authResponse;
