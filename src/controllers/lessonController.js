import { StatusCodes } from "http-status-codes";
import { lessonService } from "../services/lessonService";
import { sendSuccess, sendError } from "../utils/Api";
import getTokenHeader from "../utils/token";


const createLesson = async (req, res, next) => {
    try {
        const account = getTokenHeader(res, req, next);
        const chapterId = req.params.chapterId;
        const lesson = req.body;
        lesson.teacherId = account.id;
        const newLesson = await lessonService.createLesson(chapterId, lesson);
        sendSuccess(res, "Create lesson successfully", newLesson);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const editLesson = async (req, res, next) => {
    try {
        const chapterId = req.params.chapterId;
        const lessonId = req.params.lessonId;
        const lesson = req.body;
        await lessonService.editLesson(chapterId, lessonId, lesson);
        sendSuccess(res, "Edit lesson successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const deleteLesson = async (req, res, next) => {
    try {
        const chapterId = req.params.chapterId;
        const lessonId = req.params.lessonId;
        const lesson = req.body;
        await lessonService.deleteLesson(chapterId, lessonId, lesson);
        sendSuccess(res, "Delete lesson successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

export const lessonController = {
    createLesson,
    editLesson,
    deleteLesson
}