"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const match = error.message.match(/"([^"]*)"/);
    const name = match && match[1];
    const errors = [
        {
            path: '',
            message: `${name} is already exists`,
        },
    ];
    const statusCode = 409;
    return {
        statusCode,
        message: 'Duplicate Key Error',
        errorMessages: errors,
    };
};
exports.default = handleDuplicateError;
