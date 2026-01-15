"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = exports.Faq = exports.Public = void 0;
const mongoose_1 = require("mongoose");
const publicSchema = new mongoose_1.Schema({
    content: { type: String },
    type: { type: String, enum: ['refund-policy', 'terms-and-condition', 'contact', 'about'] },
}, {
    timestamps: true,
});
exports.Public = (0, mongoose_1.model)('Public', publicSchema);
const faqSchema = new mongoose_1.Schema({
    question: { type: String },
    answer: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, {
    timestamps: true,
});
exports.Faq = (0, mongoose_1.model)('Faq', faqSchema);
const contactSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String, optional: true },
    message: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
}, {
    timestamps: true,
});
exports.Contact = (0, mongoose_1.model)('Contact', contactSchema);
