import { examService } from "../services/examService";
import { sendError } from "../utils/Api";
import getTokenHeader from "../utils/token";


const takeExam = async (req, res, next) => {
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


        for (var i = 0; i < exam.questions.length; i++) {
            if (exam.questions[i].typeQ === "CHOICE") {
                _test.total += 1;                    
                if (_test.answers[i].result[0].answer == exam.questions[i].answers[0].correct) {
                    _test.answers[i].result[0].correct = true;
                    _test.answers[i].result[0].point = exam.questions[i].answers[0].point;
                    _test.point += exam.questions[i].answers[0].point;
                    _test.correct += 1;

                } else {                    
                    _test.answers[i].result[0].correct = false;
                    _test.answers[i].result[0].point = 0;
                }
            } else {
                for (var j = 0; j < exam.questions[i].answers.length; j++) {
                    _test.total += 1;
                    if (_test.answers[i].result[j].answer == exam.questions[i].answers[j].correct) {
                        _test.answers[i].result[j].correct = true;
                        _test.answers[i].result[j].point = exam.questions[i].answers[j].point;
                        _test.point += exam.questions[i].answers[j].point;
                        _test.correct += 1;
                        console.log(_test.answers[i].result[j].answer)
                    } else {
                        _test.answers[i].result[j].correct = false;
                        _test.answers[i].result[j].point = 0;
                    }
                }
            }
        }

        console.log(_test);



        // res.status(200).json(_test);
    } catch (error) {
        sendError(res, error.message, error.stack, 404);
        next();
    }
}

export const testController = {
    takeExam
}