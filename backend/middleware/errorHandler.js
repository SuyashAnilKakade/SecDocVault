const ApiError = require("../utils/ApiError");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {

    console.error(err);

    // ApiError
    if (err instanceof ApiError) {

        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: [],
        });

    }

    // Multer File Size Error
    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "File size should not exceed 10 MB.",
                errors: [],
            });

        }

    }

    // Multer File Type Error
    if (err.message === "Only PDF, PNG and JPG files are allowed.") {

        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: err.message,
            errors: [],
        });

    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {

        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid access token.",
            errors: [],
        });

    }

    if (err.name === "TokenExpiredError") {

        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Access token expired.",
            errors: [],
        });

    }

    // Mongo Validation
    if (err.name === "ValidationError") {

        const errors = Object.values(err.errors).map(
            item => item.message
        );

        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Validation failed.",
            errors,
        });

    }

    // Mongo Duplicate Key
    if (err.code === 11000) {

        return res.status(409).json({
            success: false,
            statusCode: 409,
            message: "Duplicate value found.",
            errors: [],
        });

    }

    // Default
    return res.status(500).json({

        success: false,

        statusCode: 500,

        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message,

        errors:
            process.env.NODE_ENV === "production"
                ? []
                : [err.stack],

    });

};

module.exports = errorHandler;