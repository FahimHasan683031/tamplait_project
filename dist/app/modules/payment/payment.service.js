"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const payment_model_1 = require("./payment.model");
const createPaymentSession_1 = require("../../../stripe/createPaymentSession");
// Create seassion
const creatSession = async (user, referenceId, amount) => {
    const url = await (0, createPaymentSession_1.createPaymentSession)(user, amount, referenceId);
    return { url };
};
// create payment
const createPayment = async (payload) => {
    const payment = await payment_model_1.Payment.create(payload);
    return payment;
};
// get payments
const getPayments = async (query) => {
    const paymentQueryBuilder = new QueryBuilder_1.default(payment_model_1.Payment.find(), query)
        .filter()
        .sort()
        .paginate();
    const payments = await paymentQueryBuilder.modelQuery;
    const paginationInfo = await paymentQueryBuilder.getPaginationInfo();
    return {
        data: payments,
        meta: paginationInfo,
    };
};
// get payment by id
const getPaymentById = async (id) => {
    return await payment_model_1.Payment.findById(id).populate('referenceId');
};
exports.PaymentService = {
    creatSession,
    createPayment,
    getPayments,
    getPaymentById,
};
