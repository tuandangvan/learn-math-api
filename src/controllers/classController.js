import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../utils/Api";
import { classService } from "../services/classService";
import { accountService } from "../services/accountService";
import Role from "../utils/enums";
import getTokenHeader from "../utils/token";

//admin
const createClass = async (req, res, next) => {
    try {
        const _class = req.body;
        const newClass = await classService.createClass(_class);

        //add book
        const _book = [{
            type: "TEXTBOOK",
            name: "Sách giáo khoa",
            description: "Mô tả"
        },
        {
            type: "THINKING",
            name: "Sách tư duy",
            description: "Mô tả"
        },
        {
            type: "ADVANCED",
            name: "Sách nâng cao",
            description: "Mô tả"
        },
        {
            type: "FMO",
            name: "Toán học quốc tế FMO",
            description: "Mô tả"
        },
        ];
        const classId = newClass._id;
        for (let i = 0; i < _book.length; i++) {
            await classService.createBook(classId, _book[i]);
        }
        sendSuccess(res, "Create class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const editClass = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const _class = req.body;
        const _editClass = await classService.editClass(classId, _class);
        sendSuccess(res, "Edit class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

//teacher
const addTeacher = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const teacherId = req.body.teacherId;
        const teacherExist = await classService.teacherExist(classId, teacherId);
        if (teacherExist) {
            sendError(res, "Teacher has been added", null, StatusCodes.NOT_ACCEPTABLE);
            return;
        }
        const teacher = await accountService.findAccountByRole(Role.TEACHER, teacherId);
        if (!teacher) {
            sendError(res, "Teacher not found", null, StatusCodes.NOT_FOUND);
            return;
        }
        await classService.addTeacher(classId, teacherId);
        sendSuccess(res, "Add a teacher into class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const removeTeacher = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const teacherId = req.body.teacherId;
        const teacherExist = await classService.teacherExist(classId, teacherId);
        if (!teacherExist) {
            sendError(res, "Teacher not found in class", null, StatusCodes.NOT_FOUND);
            return;
        }
        const teacher = await accountService.findAccountByRole(Role.TEACHER, teacherId);
        if (!teacher) {
            sendError(res, "Teacher not found", null, StatusCodes.NOT_FOUND);
            return;
        }
        await classService.removeTeacher(classId, teacherId);
        sendSuccess(res, "Remove a teacher successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const addBook = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const book = req.body;
        await classService.createBook(classId, book);
        sendSuccess(res, "Add a book into class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }

}

const editBook = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const bookId = req.params.bookId;
        const book = req.body;
        await classService.editBook(classId, bookId, book);
        sendSuccess(res, "Edit a book into class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }

}

//student
const addStudent = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const studentId = req.body.studentId;
        const studentExist = await classService.studentExist(classId, studentId);
        if (studentExist) {
            sendError(res, "Student has been added", null, StatusCodes.NOT_ACCEPTABLE);
            return;
        }
        const student = await accountService.findAccountByRole(Role.STUDENT, studentId);
        if (!student) {
            sendError(res, "Student not found", null, StatusCodes.NOT_FOUND);
            return;
        }
        await classService.addStudent(classId, studentId);
        sendSuccess(res, "Add a student into class successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const removeStudent = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const studentId = req.body.studentId;
        const studentExist = await classService.studentExist(classId, studentId);
        if (!studentExist) {
            sendError(res, "Student not found", null, StatusCodes.NOT_FOUND);
            return;
        }
        const student = await accountService.findAccountByRole(Role.STUDENT, studentId);
        if (!student) {
            sendError(res, "Student not found", null, StatusCodes.NOT_FOUND);
            return;
        }
        await classService.removeStudent(classId, studentId);
        sendSuccess(res, "Remove a student successfully", null);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getListClass = async (req, res, next) => {
    try {
        const listClass = await classService.findListClass();
        sendSuccess(res, "Get list class successfully", listClass);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getClass = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const _class = await classService.findClass(classId);
        sendSuccess(res, "Get class successfully", _class);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getBook_Chapter_Lesson = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const book_chapter_lesson = await classService.getBook_Chapter_Lesson(classId);
        sendSuccess(res, "Get book, chapter, lesson successfully", book_chapter_lesson);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}

const getClassByAccountId = async (req, res, next) => {
    try {
        const acc = getTokenHeader(res, req, next);
        const _class = await accountService.getClassByAccountId(acc.id);
        sendSuccess(res, "Get class successfully", _class);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
        next();
    }
}


export const classController = {
    //genaral
    getListClass,
    getClass,
    getBook_Chapter_Lesson,

    //admin
    createClass,
    editClass,

    //teacher
    addTeacher,
    removeTeacher,
    addBook,
    editBook,

    //student
    addStudent,
    removeStudent,
    getClassByAccountId

}