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
        // if (data.type === "LESSON") {
        //     await chapterService.addExamToLesson(data.chapterId, data.lessonId, examId);
        // }
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const type = req.query.type;
        const acc = getTokenHeader(res, req, next);
        const classId = await accountService.findClassByAccountId(acc.id);
        const { exams, count } = await examService.getListExam2(type, classId, page, limit);
        const result = [];
        const date = new Date();
        date.setHours(date.getHours() + 7);

        for (let i = 0; i < exams.length; i++) {
            var statusTest = 'NONE';//NONE la chua lam lan nao

            //lay danh sach bai da thuc hien
            const testAttempt = await testService.getTestAttempt(exams[i]._id, acc.id);
            if (testAttempt.length == exams[i].numberOfAttempts) {
                statusTest = 'END';
            }

            for (let j = 0; j < testAttempt.length; j++) {
                const dateEnd = new Date(exams[i].endTime);
                const dateEnd2 = new Date(testAttempt[j].startTime);
                dateEnd2.setMinutes(dateEnd.getMinutes() + exams[i].time);
                if (testAttempt[j].status === 'PENDING' && (date > dateEnd || date > dateEnd2)) {
                    const test = await testService.getTestById(testAttempt[j]._id);
                    if (date > dateEnd) {
                        test.endTime = exams[i].endTime;
                    } else {
                        test.endTime = dateEnd2;
                    }
                    test.status = "FINISHED";
                    test.total = 0;
                    test.correct = 0;
                    test.point = 0;
                    for (var k = 0; k < test.answers.length; k++) {
                        if (test.answers[k].typeQ === "CHOICE") {
                            test.total += 1;
                            if (test.answers[k].result[0].correct) {
                                test.point += test.answers[k].result[0].point;
                                test.correct += 1;
                            }
                        } else {
                            for (var l = 0; l < exams[i].questions[k].answers.length; l++) {
                                test.total += 1;
                                if (test.answers[k].result[l].correct) {
                                    test.point += test.answers[k].result[l].point;
                                    test.correct += 1;
                                }
                            }
                        }
                    }
                    await testService.finishTestTimeout(test);
                    test.answers = undefined;
                    testAttempt[j] = test;
                } else if (testAttempt[j].status === 'PENDING' && (date < dateEnd && date < dateEnd2)) {
                    testAttempt[j].answers = undefined;
                    statusTest = 'PENDING';
                }
            }

            result.push({
                ...exams[i].toObject(),
                questions : undefined,
                statusTest: statusTest,
                listTest: testAttempt
            });
        }

        sendSuccess(res, "Get list exam successfully", {
            listExams: result,
            page: page,
            totalPage: Math.ceil(count / limit)
        });
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

const getExameByCreater = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const type = req.query.type || 'LESSON';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const acc = getTokenHeader(res, req, next);
        const { exams, count } = await examService.findExamCreater(acc.id, classId, type, page, limit);
        sendSuccess(res, "Get list exam successfully", {
            listExams: exams,
            page: page,
            totalPage: Math.ceil(count / limit)
        });
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
    getExamById,
    getExameByCreater
}