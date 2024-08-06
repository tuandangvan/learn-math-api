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

const getBookPublic = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const book = await chapterService.findBookPublic(classId);
        sendSuccess(res, "Get book successfully", book);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getListChapterByBookId = async (req, res, next) => {
    try {
        const bookId = req.params.bookId;
        const chapters = await chapterService.findListChapterByBook(bookId);
        sendSuccess(res, "Get chapters successfully", chapters);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getChapter = async (req, res, next) => {
    try {
        const chapterId = req.params.chapterId;
        const chapter = await chapterService.findChapterById(chapterId);
        sendSuccess(res, "Get chapter successfully", chapter);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

export const chapterController = {
    createChapter,
    editChapter,
    deleteChapter,
    getBook,
    getListChapterByBookId,
    getChapter,
    getBookPublic
}