"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const client = (0, twilio_1.default)(config_1.default.twilio.accountSid, config_1.default.twilio.authToken);
const sendSMS = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: config_1.default.twilio.twilioNumber,
            to: to,
        });
        console.log("Send Message Successfully");
        return {
            invalid: false,
            message: `Message sent successfully to ${to}`,
        };
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send sms');
    }
};
exports.default = sendSMS;
