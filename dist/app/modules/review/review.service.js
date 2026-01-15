"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const review_model_1 = require("./review.model");
// create review
const createReview = async (payload) => {
    console.log(payload);
    const result = await review_model_1.Review.create(payload);
    return result;
};
// get all reviews
const getAllReviews = async (query) => {
    const reviewQueryBuilder = new QueryBuilder_1.default(review_model_1.Review.find(), query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const reviews = await reviewQueryBuilder.modelQuery;
    const paginationInfo = await reviewQueryBuilder.getPaginationInfo();
    return {
        reviews,
        meta: paginationInfo,
    };
};
// get single review
const getSingleReview = async (id) => {
    const result = await review_model_1.Review.findById(id);
    return result;
};
// delete review
const deleteReview = async (id) => {
    const isExist = await review_model_1.Review.findById(id);
    if (!isExist) {
        throw new Error('Review not found');
    }
    const result = await review_model_1.Review.findByIdAndDelete(id);
    return result;
};
exports.ReviewService = {
    createReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
};
