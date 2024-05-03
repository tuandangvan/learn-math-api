import { StatusCodes } from "http-status-codes";

const sendSuccess = (res, message, data) => {
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message,
        data,
    });
};

const sendError = (res, message, error, status = 404) => {
    res.status(status).json({
        status: status,
        message,
        error,
    });
};

export {
    sendSuccess,
    sendError,
};