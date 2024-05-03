import { StatusCodes } from "http-status-codes";
import { sendError } from "./Api";
import { verify } from "jsonwebtoken";
import { env } from "../config/environment";

const getTokenHeader = function (res, req, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decodeToken = verify(token, env.JWT_SECRET);
        return decodeToken;
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
    }
};

export default getTokenHeader;