"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZod = exports.createCategoryZod = void 0;
// service.validation.ts
const zod_1 = require("zod");
// Base service validation (common for all levels)
const baseCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required"),
    image: zod_1.z.string().min(1, "Image URL is required"),
    isActive: zod_1.z.boolean().default(true),
});
// Create service validation
exports.createCategoryZod = zod_1.z.object({
    body: baseCategorySchema.extend({
        parent: zod_1.z.string().optional().nullable(),
    }).strict(),
});
// Update service validation
exports.updateCategoryZod = zod_1.z.object({
    body: baseCategorySchema.partial().strict(),
});
