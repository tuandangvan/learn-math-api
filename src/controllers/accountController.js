import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/accountService";
import { jwtService } from "../utils/jwtUtils";
import { sendError, sendSuccess } from "../utils/Api";
import { env } from "../config/environment";
import getTokenHeader from "../utils/token";

const createAccount = async (req, res, next) => {
    try {
        const account = req.body;

        //check account existed
        await accountService.getAccByEmailPhone(account);
        //create account
        const newAccount = await accountService.createAccount(account);
        sendSuccess(res, "Create account successfully", newAccount);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const signIn = async (req, res, next) => {
    try {
        const accBody = req.body;
        //check account and password
        const account = await accountService.findByCredentials(accBody);

        //generate token
        const accessToken = await jwtService.generateAuthToken(account);
        const refreshToken = await jwtService.generateRefreshToken(account);
        await accountService.findByIdAndUpdate(account.id, refreshToken);
        sendSuccess(res, "Create account successfully", { account, accessToken, refreshToken });

    } catch (error) {
        sendError(res, error.message, error.stack);
        next();
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        const account = await accountService.findAccountByRefreshToken(refreshToken);
        if (!account) {
            sendError(res, "Error", null, StatusCodes.UNPROCESSABLE_ENTITY);
        }
        const newaccessToken = await jwtService.generateAuthToken(account);
        res.status(StatusCodes.OK).json({ newaccessToken });
    } catch (error) {
        const customError = new ApiError(
            StatusCodes.UNPROCESSABLE_ENTITY,
            error.message
        );
        next(customError);
    }
};

export const accountController = {
    createAccount,
    signIn,
    refreshToken
}