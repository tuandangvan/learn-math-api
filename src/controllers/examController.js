import { StatusCodes } from "http-status-codes";
import { chapterService } from "../services/chapterService";
import { classService } from "../services/classService";
import { examService } from "../services/examService";
import { sendError, sendSuccess } from "../utils/Api";
import getTokenHeader from "../utils/token";
import { testService } from "../services/testService";
import { accountService } from "../services/accountService";

const createExam = async (req, res, next) => {
    try {
        const data = req.body;
        const acc = getTokenHeader(res, req, next);
        await classService.findClass(data.classId);
        const newExam = await examService.createExam(data, acc.id);
        // if (newExam) {
        //     if (data.type === "LESSON") {
        //         await chapterService.addExamToLesson(data.chapterId, data.lessonId, newExam._id);
        //     }
        // }
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

const getListExam = async (req, res, next) => {
    try {
        const type = req.query.type;
        const acc = getTokenHeader(res, req, next);
        const classId = await accountService.findClassByAccountId(acc.id);
        const exams = await examService.getListExam(type, classId);
        // const testAttempt = await testService.getTestAttempt(exams);

        const result = [];


        for (let i = 0; i < exams.length; i++) {
            var statusTest = 'NONE';//NONE la chua lam lan nao

            //lay danh sach bai da thuc hien
            const testAttempt = await testService.getTestAttempt(exams[i]._id, acc.id);
            if (testAttempt.length == exams[i].numberOfAttempts) {
                statusTest = 'END';
            }

            for (let j = 0; j < testAttempt.length; j++) {
                testAttempt[j].answers = undefined;
                if (testAttempt[j].status === 'PENDING') {
                    statusTest = 'PENDING';
                }
            }

            result.push({
                ...exams[i].toObject(),
                statusTest: statusTest,
                listTest: testAttempt
            });


        }

        sendSuccess(res, "Get list exam successfully", result);
    } catch (error) {
        sendError(res, error.message, error.stack, 400);
        next();
    }
}

const getExamById = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const exam = await examService.getExamById(examId, page, limit);
        const resultExam = {
            ...exam.exam.toObject(),
            page: page,
            totalPage: Math.ceil(exam.count / limit)
        };
        sendSuccess(res, "Get exam successfully", resultExam);
    } catch (error) {
        sendError(res, error.message, error.stack, 400);
        next();
    }
}

export const examController = {
    createExam,
    editExam,
    deleteExam,
    getListExam,
    getExamById
}