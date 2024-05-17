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

const findListClass = async function () {
    const listClass = await Class.find({ deleted: false }, "id name teacherIds studentIds description");
    return listClass;
}

const checkClassExist = async function (classId) {
    //check class exist
    const bookExist = await Class.findOne({ _id: classId, deleted: false });
    if (!bookExist) {
        throw new Error("Class not found");
    }
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

const createBook = async function (classId, book) {
    await checkClassExist(classId);
    //check book exist in class
    const bookExistInClass = await Class.findOne({ _id: classId, deleted: false, "books.type": book.type });
    if (bookExistInClass) {
        throw new Error("Book exist in class");
    }

    const newBook = {
        _id: new mongoose.Types.ObjectId(),
        ...book
    }
    const createBook = await Class.updateOne({ _id: classId },
        {
            $push: {
                books: newBook
            }
        })
    return createBook;
}

const editBook = async function (classId, bookId, book) {
    await checkClassExist(classId);
    const bookExistInClass = await Class.findOne({ _id: classId, "books._id": bookId });
    if (!bookExistInClass) {
        throw new Error("Book not found in class");
    }
    const editBook = await Class.updateOne({ _id: classId, "books._id": bookId },
        {
            $set: {
                "books.$.type": book.type,
                "books.$.name": book.name,
                "books.$.description": book.description,
                "books.$.image": book.image
            }
        });
    return editBook;
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

const findClass = async function (classId) {
    await checkClassExist(classId);
    const _class = await Class.findById(classId);
    return _class;
}

export const classService = {
    //admin
    createClass,
    editClass,

    //general
    teacherExist,
    studentExist,
    findListClass,
    findClass,

    //teacher
    addTeacher,
    removeTeacher,
    createBook,
    editBook,

    //student
    addStudent,
    removeStudent
}

export default checkClassExist;