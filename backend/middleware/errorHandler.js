const { ValidationError } = require("joi");

const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: "Internal Server Error",
    };

    if (error instanceof ValidationError) {
        statusCode = 422;
        data.message = error.message;

        return res.status(statusCode).json(data);
    }

    if (error.status) {
        statusCode = error.status;
    }

    if (error.message) {
        data.message = error.message;
    }

    return res.status(statusCode).json(data);
};

module.exports = errorHandler;
