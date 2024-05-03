import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { env } from "../config/environment.js";
const authencation = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      sendError(res, "Token is required", null, StatusCodes.UNPROCESSABLE_ENTITY);
    }

    const token = req.header("Authorization").replace("Bearer ", "");
    const data = verify(token, env.JWT_SECRET);
    if (!data) {
      sendError(res, "Token is invalid", null, StatusCodes.UNPROCESSABLE_ENTITY);
    }

    if (!data.id) {
      sendError(res, "Account not found", null, StatusCodes.UNPROCESSABLE_ENTITY);
    }

    // if (req.route.path != "/refresh-token") {
    //   if (data.access == false)
    //     throw new ApiError(StatusCodes.FORBIDDEN, TokenError.tokenNotAccess);
    // }

    // if (req.route.path == "/refresh-token") {
    //   if (data.access == true)
    //     throw new ApiError(StatusCodes.FORBIDDEN, TokenError.tokenNotRefresh);
    // }
    next();
  } catch (error) {
    sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
    next();
  }
};
export default authencation;
