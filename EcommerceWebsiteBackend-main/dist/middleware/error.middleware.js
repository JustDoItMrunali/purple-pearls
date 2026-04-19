"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[Error] ${statusCode} - ${message}`);
    res.status(statusCode).json({
        status: "error",
        error: message,
    });
};
exports.globalErrorHandler = globalErrorHandler;
