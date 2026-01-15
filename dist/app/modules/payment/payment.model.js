"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    referenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    customerName: {
        type: String,
        trim: true,
        maxlength: 100,
    },
}, { timestamps: true });
// Index for better search performance
PaymentSchema.index({ email: 1, dateTime: -1 });
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
