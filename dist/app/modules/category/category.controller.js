"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const category_service_1 = require("./category.service");
const http_status_codes_1 = require("http-status-codes");
// create service
const createCategory = async (req, res) => {
    const payload = req.body;
    const result = await category_service_1.serviceService.createCategory(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
};
// get all services
const getAllCategories = async (req, res) => {
    const result = await category_service_1.serviceService.getAllCategories(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
};
// update service
const updateCategory = async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await category_service_1.serviceService.updateCategory(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
};
// delete service
const deleteCategory = async (req, res) => {
    const id = req.params.id;
    const result = await category_service_1.serviceService.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category deleted successfully",
    });
};
exports.categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
