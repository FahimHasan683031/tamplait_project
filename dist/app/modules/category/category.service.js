"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const category_model_1 = require("./category.model");
// Create service
const createCategory = async (payload) => {
    const result = await category_model_1.CategoryModel.create(payload);
    return result;
};
// Get all categories
const getAllCategories = async (query) => {
    const categoryQueryBuilder = new QueryBuilder_1.default(category_model_1.CategoryModel.find({ isActive: true, parent: null }), query)
        .filter()
        .fields();
    const totalCategories = await category_model_1.CategoryModel.countDocuments();
    const categories = await categoryQueryBuilder.modelQuery;
    return {
        categories,
    };
};
// Update service
const updateCategory = async (id, payload) => {
    const result = await category_model_1.CategoryModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};
// Delete service
const deleteCategory = async (id) => {
    const result = await category_model_1.CategoryModel.findByIdAndDelete(id);
    return result;
};
exports.serviceService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
