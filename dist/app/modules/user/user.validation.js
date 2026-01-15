"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.changePasswordSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userSignupSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.userSignupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address").toLowerCase().trim(),
        firstName: zod_1.z.string().min(1, "First name is required"),
        lastName: zod_1.z.string().min(1, "Last name is required"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        role: zod_1.z.nativeEnum(user_interface_1.USER_ROLES).default(user_interface_1.USER_ROLES.Business),
    })
});
exports.userLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address").toLowerCase().trim(),
        password: zod_1.z.string().min(1, "Password is required"),
    })
});
exports.userUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address").trim().toLowerCase().optional(),
        firstName: zod_1.z.string().min(1, "First name is required").optional(),
        lastName: zod_1.z.string().min(1, "Last name is required").optional(),
        image: zod_1.z.string().url("Invalid image URL").optional(),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
        status: zod_1.z.nativeEnum(user_interface_1.USER_STATUS).optional(),
        verified: zod_1.z.boolean().optional(),
        role: zod_1.z.nativeEnum(user_interface_1.USER_ROLES).optional(),
    })
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, "Current password is required"),
        newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
    })
});
exports.UserValidations = {
    userSignupSchema: exports.userSignupSchema,
    userLoginSchema: exports.userLoginSchema,
    userUpdateSchema: exports.userUpdateSchema,
    changePasswordSchema: exports.changePasswordSchema,
};
