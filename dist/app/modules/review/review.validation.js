"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidationSchema = void 0;
const zod_1 = require("zod");
exports.ReviewValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        rating: zod_1.z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
        comment: zod_1.z.string().optional(),
    })
});
