import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/account";
import { jwtService } from "../utils/jwtUtils";
import { sendError, sendSuccess } from "../utils/Api";

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



export const accountController = {
    createAccount,
    signIn
}