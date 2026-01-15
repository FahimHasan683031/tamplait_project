"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlanZodValidationSchema = exports.createPlanZodValidationSchema = void 0;
const zod_1 = require("zod");
exports.createPlanZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        description: zod_1.z.string({ required_error: "Description is required" }),
        price: zod_1.z.number({ required_error: "Price is required" }),
        duration: zod_1.z.enum(["1 month", "3 months", "6 months", "1 year"], { required_error: "Duration is required" }),
        paymentType: zod_1.z.enum(["Monthly", "Yearly"], { required_error: "Payment type is required" }),
        features: zod_1.z.array(zod_1.z.string({ required_error: "Feature is required" }), { required_error: "Features are required" }),
    })
});
// update plan zod validation schema
exports.updatePlanZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }).optional(),
        description: zod_1.z.string({ required_error: "Description is required" }).optional(),
        price: zod_1.z.number({ required_error: "Price is required" }).optional(),
        duration: zod_1.z.enum(["1 month", "3 months", "6 months", "1 year"], { required_error: "Duration is required" }).optional(),
        paymentType: zod_1.z.enum(["Monthly", "Yearly"], { required_error: "Payment type is required" }).optional(),
        features: zod_1.z.array(zod_1.z.string({ required_error: "Feature is required" }), { required_error: "Features are required" }).optional(),
    })
});
