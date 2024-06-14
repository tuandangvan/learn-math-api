import mongoose from 'mongoose';
import Test from '../models/testModel';

const createTest = async function (data) {
    const newTest = new Test({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return newTest.save();
}

export const testService = {
    createTest
}