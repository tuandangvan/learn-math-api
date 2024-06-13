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

export const examService = {
    createExam,
    editExam,
    deleteExam
}