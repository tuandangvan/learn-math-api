import { chapterService } from "../services/chapterService";
import { examService } from "../services/examService";
import { sendError, sendSuccess } from "../utils/Api";
import getTokenHeader from "../utils/token";

const createExam = async (req, res, next) => {
    try {
        const data = req.body;
        const acc = getTokenHeader(res, req, next);
        const newExam = await examService.createExam(data, acc.id);
        if (newExam) {
            if (data.type === "LESSON") {
                await chapterService.addExamToLesson(data.chapterId, data.lessonId, newExam._id);
            }
        }
        sendSuccess(res, "Create exam successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, 400);
        next();
    }
}

const editExam = async (req, res, next) => {
    try {
        const data = req.body;
        const examId = req.params.examId;
        await examService.editExam(examId, data);
        if (data.type === "LESSON") {
            await chapterService.addExamToLesson(data.chapterId, data.lessonId, examId);
        }
        sendSuccess(res, "Edit exam successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, 400);
        next();
    }
}

const deleteExam = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        await examService.deleteExam(examId);
        sendSuccess(res, "Delete exam successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, 400);
        next();

    }
}

export const examController = {
    createExam,
    editExam,
    deleteExam
}