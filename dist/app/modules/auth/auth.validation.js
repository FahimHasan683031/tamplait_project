"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const user_1 = require("../../../enum/user");
const verifyEmailOrPhoneOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\S+@\S+\.\S+$/.test(value), {
            message: 'Invalid email format',
        }),
        phone: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
            message: 'Invalid phone number format',
        }),
        oneTimeCode: zod_1.z.string().min(1, { message: 'OTP is required' }),
    }),
});
const forgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\S+@\S+\.\S+$/.test(value), {
            message: 'Invalid email format',
        }),
        phone: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
            message: 'Invalid phone number format',
        }),
    }),
});
const resetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6, { message: 'Password is required' }),
        confirmPassword: zod_1.z
            .string()
            .min(6, { message: 'Confirm Password is required' }),
    }),
});
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\S+@\S+\.\S+$/.test(value), {
            message: 'Invalid email format',
        }),
        phone: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
            message: 'Invalid phone number format',
        }),
        deviceToken: zod_1.z.string().min(1).optional(),
        password: zod_1.z.string({ message: 'Credentials are required' }).min(6, { message: 'Invalid Credentials' }),
    }),
});
const verifyAccountZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .refine(value => !value || /^\S+@\S+\.\S+$/.test(value), {
            message: 'Invalid email format',
        }),
        phone: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
            message: 'Invalid phone number format',
        }),
        oneTimeCode: zod_1.z.string().min(1, { message: 'OTP is required' }),
    }),
});
const resendOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\S+@\S+\.\S+$/.test(value), {
            message: 'Invalid email format',
        }),
        phone: zod_1.z
            .string()
            .optional()
            .refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
            message: 'Invalid phone number format',
        }),
        authType: zod_1.z.string(zod_1.z.enum(['resetPassword', 'createAccount']))
    }),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required',
        }),
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(8, 'Password must be at least 8 characters'),
        confirmPassword: zod_1.z.string({
            required_error: 'Confirm password is required',
        }),
    })
        .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }),
});
const deleteAccount = zod_1.z.object({
    body: zod_1.z
        .object({
        password: zod_1.z.string({
            required_error: 'Password is required',
        })
    })
});
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email(),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(6),
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        phone: zod_1.z.string({ required_error: 'Phone is required' }).optional(),
        address: zod_1.z.string().optional(),
        role: zod_1.z.enum([
            user_1.USER_ROLES.ADMIN,
            user_1.USER_ROLES.Business,
        ], {
            message: 'Role must be one of admin, user, guest',
        }),
    }),
});
exports.AuthValidations = {
    verifyEmailOrPhoneOtpZodSchema,
    forgetPasswordZodSchema,
    resetPasswordZodSchema,
    loginZodSchema,
    verifyAccountZodSchema,
    resendOtpZodSchema,
    changePasswordZodSchema,
    createUserZodSchema,
    deleteAccount,
};
