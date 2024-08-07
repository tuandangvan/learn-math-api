import { accountService } from "../services/accountService";
import { examService } from "../services/examService";
import { testService } from "../services/testService";
import { sendError, sendSuccess } from "../utils/Api";
import { constFunction } from "../utils/constFunction";
import getTokenHeader from "../utils/token";


const createTest = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const token = getTokenHeader(res, req, next);
        const createBy = token.id;
        const _test = req.body;

        //kiem tra exam co ton tai khong
        const exam = await examService.findExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        //kiem tra account co nam trong lop khong
        const account = await accountService.findAccountById(createBy);
        if (account.classId.toString() != exam.classId.toString()) {
            throw new Error('You are not in this class');
        }

        //kiem tra exam co dang mo khong
        const date = new Date();
        date.setHours(date.getHours() + 7);
        if (exam.startTime > date || exam.endTime < date) {
            throw new Error('Exam is not open yet');
        }

        //kiem tra so lan lam bai thi
        const tests = await testService.getTestAttempt(examId, createBy);
        if (tests.length >= exam.numberOfAttempts) {
            throw new Error('You have reached the maximum number of attempts');
        }

        //kiem tra co dang trong trang thai lam bai thi khong
        const testPending = await testService.getTestPendingByCreateBy(examId, createBy);
        if (testPending) {
            throw new Error('You have a test pending');
        }

        _test.type = exam.type;
        _test.classId = exam.classId;
        _test.name = exam.name;
        _test.point = 0;
        _test.correct = 0;
        _test.total = 0;
        _test.createBy = createBy;
        _test.examId = examId;
        _test.startTime = date;
        _test.endTime = null;
        _test.answers = [];
        for (var i = 0; i < exam.questions.length; i++) {
            if (exam.questions[i].typeQ === "CHOICE") {
                var answer_temp = {
                    sentenceNumber: exam.questions[i].sentenceNumber,
                    typeQ: exam.questions[i].typeQ,
                    result: [
                        {
                            answer: "none",
                            correct: false,
                            point: 0,
                        }
                    ]
                }
                _test.answers.push(answer_temp);
            }
            else {
                var answer_temp = {
                    sentenceNumber: exam.questions[i].sentenceNumber,
                    typeQ: exam.questions[i].typeQ,
                    result: []
                }
                for (var j = 0; j < exam.questions[i].answers.length; j++) {
                    var answer = {
                        answer: "none",
                        correct: false,
                        point: 0,
                    }
                    answer_temp.result.push(answer);
                }
                _test.answers.push(answer_temp);
            }
        }
        const result = await testService.createTest(_test);
        await constFunction.finishTest(result._id, exam, date, exam.time);
        sendSuccess(res, "Create test success", result);
    } catch (error) {
        sendError(res, error.message, error.stack, 207);
        next();
    }
}

const pushAnswer = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const testId = req.body.testId;
        const _test = req.body.answers;
        const from = req.body.from;
        const to = req.body.to;
        const finish = req.body.finish;
        const test = await testService.getTestById(testId);
        if (!test) {
            throw new Error('Test not found');
        }
        if (test.status === "FINISHED") {
            throw new Error('Test has completed');
        }
        const exam = await examService.findExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }
        const date = new Date();
        date.setHours(date.getHours() + 7);
        if (exam.endTime < date) {
            throw new Error('Test has ended');
        }

        for (var i = from - 1; i < to; i++) {
            if (exam.questions[i].typeQ === "CHOICE") {
                test.answers[i].result[0].answer = _test[i - from + 1].result[0].answer;
                if (_test[i - from + 1].result[0].answer == exam.questions[i].answers[0].correct) {
                    test.answers[i].result[0].correct = true;
                    test.answers[i].result[0].point = exam.questions[i].answers[0].point;
                } else {
                    test.answers[i].result[0].correct = false;
                    test.answers[i].result[0].point = 0;
                }
            } else {
                for (var j = 0; j < exam.questions[i].answers.length; j++) {
                    test.answers[i].result[j].answer = _test[i - from + 1].result[j].answer;
                    if (_test[i - from + 1].result[j].answer == exam.questions[i].answers[j].correct) {
                        test.answers[i].result[j].correct = true;
                        test.answers[i].result[j].point = exam.questions[i].answers[j].point;
                    } else {
                        test.answers[i].result[j].correct = false;
                        test.answers[i].result[j].point = 0;
                    }
                }
            }
        }
        if (finish) {
            test.endTime = date;
            test.status = "FINISHED";
            test.total = 0;
            test.correct = 0;
            test.point = 0;
            for (var i = 0; i < test.answers.length; i++) {
                if (test.answers[i].typeQ === "CHOICE") {
                    test.total += 1;
                    if (test.answers[i].result[0].correct) {
                        test.point += test.answers[i].result[0].point;
                        test.correct += 1;
                    }
                } else {
                    for (var j = 0; j < exam.questions[i].answers.length; j++) {
                        test.total += 1;
                        if (test.answers[i].result[j].correct) {
                            test.point += test.answers[i].result[j].point;
                            test.correct += 1;
                        }
                    }
                }
            }
        }
        const result = await testService.pushAnswer(testId, test);
        await examService.updateQuantity(examId);
        sendSuccess(res, "Push answer success", result);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}

const getTestByIdPending = async (req, res, next) => {
    try {
        const testId = req.params.testId;
        const test = await testService.getTestByIdPending(testId);
        sendSuccess(res, "Get test success", test);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}


// const takeExam = async (req, res, next) => {
//     try {
//         const examId = req.params.examId;
//         const token = getTokenHeader(res, req, next);
//         const createBy = token.id;
//         const _test = req.body;
//         const exam = await examService.findExamById(examId);
//         if (!exam) {
//             throw new Error('Exam not found');
//         }
//         _test.point = 0;
//         _test.correct = 0;
//         _test.total = 0;
//         _test.createBy = createBy;
//         _test.examId = examId;
//         for (var i = 0; i < exam.questions.length; i++) {
//             if (exam.questions[i].typeQ === "CHOICE") {
//                 _test.total += 1;
//                 if (_test.answers[i].result[0].answer == exam.questions[i].answers[0].correct) {
//                     _test.answers[i].result[0].correct = true;
//                     _test.answers[i].result[0].point = exam.questions[i].answers[0].point;
//                     _test.point += exam.questions[i].answers[0].point;
//                     _test.correct += 1;

//                 } else {
//                     _test.answers[i].result[0].correct = false;
//                     _test.answers[i].result[0].point = 0;
//                 }
//             } else {
//                 for (var j = 0; j < exam.questions[i].answers.length; j++) {
//                     _test.total += 1;
//                     if (_test.answers[i].result[j].answer == exam.questions[i].answers[j].correct) {
//                         _test.answers[i].result[j].correct = true;
//                         _test.answers[i].result[j].point = exam.questions[i].answers[j].point;
//                         _test.point += exam.questions[i].answers[j].point;
//                         _test.correct += 1;
//                     } else {
//                         _test.answers[i].result[j].correct = false;
//                         _test.answers[i].result[j].point = 0;
//                     }
//                 }
//             }
//         }
//         const result = await testService.createTest(_test);
//         await examService.updateAttempts(examId);
//         sendSuccess(res, "Take exam successfully", result);
//     } catch (error) {
//         sendError(res, error.message, error.stack, 404);
//         next();
//     }
// }

const getTestsExam = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const acc = getTokenHeader(res, req, next);
        const createBy = acc.id;
        const tests = await testService.getTestsExam(examId, createBy);
        sendSuccess(res, "Get test success", tests);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}

const getTestById = async (req, res, next) => {
    try {
        const testId = req.params.testId;
        const test = await testService.getTestById(testId);
        sendSuccess(res, "Get test success", test);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}

const getTestCompletedById = async (req, res, next) => {
    try {
        const testId = req.params.testId;
        const test = await testService.getTestCompletedById(testId);
        sendSuccess(res, "Get test success", test);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}

export const testController = {
    createTest,
    pushAnswer,
    // takeExam,
    getTestsExam,
    getTestById,
    getTestByIdPending,
    getTestCompletedById

}