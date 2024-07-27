import { examService } from "../services/examService";
import { testService } from "../services/testService";
import { sendError, sendSuccess } from "../utils/Api";
import getTokenHeader from "../utils/token";


const createTest = async (req, res, next) => {
    try {
        const examId = req.params.examId;
        const token = getTokenHeader(res, req, next);
        const createBy = token.id;
        const _test = req.body;
        const exam = await examService.findExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }
        _test.point = 0;
        _test.correct = 0;
        _test.total = 0;
        _test.createBy = createBy;
        _test.examId = examId;
        //chuyển sang giờ viet nam
        const date = new Date();
        date.setHours(date.getHours() + 7);
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
        sendSuccess(res, "Create test success", result);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
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
            test.answers[i].result[0].answer = _test[i - from + 1].result[0].answer;
            if (exam.questions[i].typeQ === "CHOICE") {
                if (_test[i - from + 1].result[0].answer == exam.questions[i].answers[0].correct) {
                    test.answers[i].result[0].correct = true;
                    test.answers[i].result[0].point = exam.questions[i].answers[0].point;
                    test.point += exam.questions[i].answers[0].point;
                } else {
                    test.answers[i].result[0].correct = false;
                    test.answers[i].result[0].point = 0;
                }
            } else {
                for (var j = 0; j < exam.questions[i].answers.length; j++) {
                    if (_test[i - from + 1].result[j].answer == exam.questions[i].answers[j].correct) {
                        test.answers[i].result[j].correct = true;
                        test.answers[i].result[j].point = exam.questions[i].answers[j].point;
                        test.point += exam.questions[i].answers[j].point;
                    } else {
                        test.answers[i].result[j].correct = false;
                        test.answers[i].result[j].point = 0;
                    }
                }
            }
        }
        const result = await testService.pushAnswer(testId, test);
        if (finish) {

        }
        sendSuccess(res, "Push answer success", result);
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

export const testController = {
    createTest,
    pushAnswer,
    // takeExam,
    getTestsExam,
    getTestById

}