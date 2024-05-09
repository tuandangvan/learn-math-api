import { StatusCodes } from "http-status-codes";
import { chapterService } from "../services/chapterService";
import { sendError, sendSuccess } from "../utils/Api";
import getTokenHeader from "../utils/token";


const createChapter = async (req, res, next) => {
    try {
        const account = getTokenHeader(res, req, next);
        const chapter = req.body;
        chapter.teacherId = account.id;
        const newChapter = await chapterService.createChapter(chapter);
        sendSuccess(res, "Create chapter successfully", newChapter);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const editChapter = async (req, res, next) => {
    try {
        const chapter = req.body;
        const chapterId = req.params.chapterId;
        await chapterService.editChapter(chapterId, chapter);
        sendSuccess(res, "Edit chapter successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const deleteChapter = async (req, res, next) => {
    try {
        const chapterId = req.params.chapterId;
        await chapterService.deleteChapter(chapterId);
        sendSuccess(res, "Delete chapter successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getBook = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        const book = await chapterService.findBook(bookId);
        sendSuccess(res, "Get book successfully", book);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

export const chapterController = {
    createChapter,
    editChapter,
    deleteChapter,
    getBook
}