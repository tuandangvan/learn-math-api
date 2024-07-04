import { StatusCodes } from "http-status-codes";
import { accountService } from "../services/accountService";
import { jwtService } from "../utils/jwtUtils";
import { sendError, sendSuccess } from "../utils/Api";
import getTokenHeader from "../utils/token";
import { hashSync } from "bcrypt";

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
        sendSuccess(res, "Log-in success", { account, accessToken, refreshToken });

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

const getListTeacher = async (req, res, next) => {
    try {
        const listTeacher = await accountService.findListTeacher();
        sendSuccess(res, "Get list teacher successfully", listTeacher);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getTeacherById = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const account = await accountService.findAccountById(accountId);
        if (account.role != "TEACHER") {
            sendError(res, "Account not found", null, StatusCodes.UNPROCESSABLE_ENTITY);
        }
        sendSuccess(res, "Get account successfully", account);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }

}

const getStudentById = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const account = await accountService.findAccountById(accountId);
        if (account.role != "STUDENT") {
            sendError(res, "Account not found", null, StatusCodes.UNPROCESSABLE_ENTITY);
        }
        sendSuccess(res, "Get account successfully", account);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }

}

const changePassword = async (req, res, next) => {
    try {
        const acc = getTokenHeader(res, req, next);
        const password = req.body.password;
        const newPassword = req.body.newPassword;
        await accountService.findByCredentials({ account: acc.email, password: password });
        const passHash = hashSync(newPassword, 8);
        await accountService.updateAccount(acc.id, { password: passHash });
        sendSuccess(res, "Change password successfully");
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const editAccount = async (req, res, next) => {
    try {
        const acc = getTokenHeader(res, req, next);
        const data = req.body;
        await accountService.updateAccount(acc.id, data);
        sendSuccess(res, "Update account successfully");
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }

}



export const accountController = {
    createAccount,
    signIn,
    refreshToken,
    getListTeacher,
    getTeacherById,
    getStudentById,
    changePassword,
    editAccount
}