import mongoose from 'mongoose';
import Exam from '../models/examModel';

const createExam = async function (data, createBy) {
    data.createBy = createBy;
    const newExam = new Exam({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return newExam.save();
}

const editExam = async function (examId, data) {
    const exam = await Exam.findById(examId);
    if (!exam) {
        throw new Error('Exam not found');
    }
    const editExam = await Exam.updateOne({ _id: examId }, { $set: { ...data } });
    return editExam;
}

const deleteExam = async function (examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
        throw new Error('Exam not found');
    }
    const deleteExam = await Exam.updateOne({ _id: examId }, { $set: { deleted: true } });
    return deleteExam;
}

// Get list exam for all user
const getListExam = async function (type) {
    const exams = await Exam.find({ type: type, active: true, deleted: false }, { questions: 0, deleted: 0 });
    return exams;
}

const getExamById = async function (examId, page, limit) {
    //phân trang trong phần question
    const exam = await Exam.findOne({ _id: examId, active: true, deleted: false },
        { deleted: 0, questions: { $slice: [(page - 1) * 5, limit] } });
    if (!exam) {
        throw new Error('Exam not found');
    }
    const count = await Exam.findOne({ _id: examId });
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const exam2 = await Exam.findOne({
        _id: examId, active: true, deleted: false,
        startTime: { $lte: date }, endTime: { $gte: date }
    });
    if (!exam2) {
        throw new Error('Not during exam time');
    }
    exam.questions.forEach(question => {
        question.answers.forEach(answer => {
            answer.correct = undefined;
        });
    });
    await Exam.updateOne({ _id: examId }, { $set: { view: exam.view + 1 } });
    exam.view += 1;
    return { exam, count: count.questions.length };
}

const findExamById = async function (examId) {
    const exam = await Exam.findOne({ _id: examId, active: true, deleted: false });
    return exam;
}
const updateAttempts = async function (examId) {
    const exam = await Exam.findById(examId);
    if (!exam) {
        throw new Error('Exam not found');
    }
    const updateAttempts = await Exam.updateOne({ _id: examId }, { $inc: { numberOfAttempts: 1 } });
    return updateAttempts;
}


export const examService = {
    createExam,
    editExam,
    deleteExam,
    getListExam,
    getExamById,
    findExamById,
    updateAttempts
}