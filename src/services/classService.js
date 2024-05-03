import mongoose from 'mongoose';
import Class from '../models/classModel.js';;


//admin
const createClass = async function (_class) {
    const newClass = new Class({
        _id: new mongoose.Types.ObjectId(),
        ..._class
    })
    return newClass.save();
}

const editClass = async function (classId, _class) {
    const _classEdit = await Class.updateOne(
        { _id: classId },
        {
            $set: { ..._class }
        });
    return _classEdit;
}

//general
const teacherExist = async function (classId, teacherId) {
    const teacher = await Class.findOne({ _id: classId, teacherIds: teacherId });
    if (teacher) return true;
    return false;
}

const studentExist = async function (classId, studentId) {
    const student = await Class.findOne({ _id: classId, studentIds: studentId });
    if (student) return true;
    return false;
}

//teacher
const addTeacher = async function (classId, teacherId) {
    const addTeacher = await Class.updateOne(
        { _id: classId },
        {
            $push: {
                teacherIds: teacherId
            }
        }
    );
    return addTeacher;
}

const removeTeacher = async function (classId, teacherId) {
    const removeTeacher = await Class.updateOne(
        { _id: classId },
        {
            $pull: {
                teacherIds: teacherId
            }
        }
    );
    return removeTeacher;
}


//student
const addStudent = async function (classId, studentId) {
    const addStudent = await Class.updateOne(
        { _id: classId },
        {
            $push: {
                studentIds: studentId
            }
        }
    );
    return addStudent;
}

const removeStudent = async function (classId, studentId) {
    const removeStudent = await Class.updateOne(
        { _id: classId },
        {
            $pull: {
                studentIds: studentId
            }
        }
    );
    return removeStudent;
}


export const classService = {
    //admin
    createClass,
    editClass,

    //general
    teacherExist,
    studentExist,

    //teacher
    addTeacher,
    removeTeacher,

    //student
    addStudent,
    removeStudent
}