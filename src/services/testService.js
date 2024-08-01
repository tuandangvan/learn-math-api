import mongoose from 'mongoose';
import Test from '../models/testModel';

const createTest = async function (data) {
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
    const { _id, ...testWithoutId } = test;
    const test_update = await Test.updateOne({ _id: testId }, { $set: testWithoutId });
    return test_update;
}

const getTestByIdPending = async function (testId) {
    const test = await Test.findOne({ _id: testId });
    if (test.status == 'FINISHED') {
        throw new Error('Test finished');
    }
    const testNew = {
        ...test.toObject(),
        answers: test.answers.map(answer => {
            return {
                sentenceNumber: answer.sentenceNumber,
                typeQ: answer.typeQ,
                result: answer.result.map(res => {
                    return {
                        answer: res.answer == "none" ? null : res.answer
                    };
                })
            }
        })
    }
    return testNew;
}

const getTestAttempt = async function (examId, createBy) {
    const test = await Test.find({ examId: examId, createBy: createBy });
    return test;
}

const getTestPendingByCreateBy = async function (examId, createBy) {
    const test = await Test.findOne({ examId: examId, createBy: createBy, status: 'PENDING' });
    return test;
}

const getTestCompletedById = async function (testId) {
    const test = await Test.findOne({ _id: testId })
        .populate('examId', 'id name')
        .populate('createBy', 'id firstName lastName avatar')
        .populate('classId', 'id name image description');
    if (test.status == 'PENDING') {
        throw new Error('Test not finished');
    }

    const updatedAnswers = {
        ...test.toObject(),
        answers: test.answers.map(answer => {
            return {
                sentenceNumber: answer.sentenceNumber,
                typeQ: answer.typeQ,
                result: answer.result.map(res => {
                    return {
                        answer: res.answer == "none" ? null : res.answer,
                        correct: res.correct,
                        point: res.point
                    };
                })
            };
        })
    };
    return updatedAnswers;
}

export const testService = {
    createTest,
    getTestsExam,
    getTestById,
    pushAnswer,
    getTestByIdPending,
    getTestAttempt,
    getTestPendingByCreateBy,
    getTestCompletedById
}