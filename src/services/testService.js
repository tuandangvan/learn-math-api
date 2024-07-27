import mongoose from 'mongoose';
import Test from '../models/testModel';

const createTest = async function (data) {
    console.log(data.answers);
    const newTest = new Test({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return newTest.save();
}

//get tests of exam of a student
const getTestsExam = async function (examId, createBy) {
    const tests = await Test.find({ examId: examId, createBy: createBy }, { answers: 0 })
        .populate('examId', 'id name')
        .populate('createBy', 'id firstName lastName avatar')
        .populate('classId');
    return tests;
}

const getTestById = async function (testId) {
    const test = await Test.findOne({ _id: testId })
        .populate('examId', 'id name')
        .populate('createBy', 'id firstName lastName avatar')
        .populate('classId');
    return test;
}

const pushAnswer = async function (testId, test) {
    const test_update = await Test.updateOne({ _id: testId, $set: { ...test } });
    return test_update;
}

export const testService = {
    createTest,
    getTestsExam,
    getTestById,
    pushAnswer
}