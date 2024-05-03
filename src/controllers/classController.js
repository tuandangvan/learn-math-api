import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../utils/Api";
import { classService } from "../services/classService";

//admin
const createClass = async (req, res, next) => {
    try {
        const _class = req.body;
        const newClass = await classService.createClass(_class);
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
        const teacher = await classService.teacherExist(classId, teacherId);
        if (teacher) {
            sendError(res, "Teacher has been added", null, StatusCodes.NOT_ACCEPTABLE);
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
        const teacher = await classService.teacherExist(classId, teacherId);
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

//student
const addStudent = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const studentId = req.body.studentId;
        const student = await classService.studentExist(classId, studentId);
        if (student) {
            sendError(res, "Student has been added", null, StatusCodes.NOT_ACCEPTABLE);
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
        const student = await classService.studentExist(classId, studentId);
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
export const classController = {
    //admin
    createClass,
    editClass,
    //teacher
    addTeacher,
    removeTeacher,
    //student
    addStudent,
    removeStudent

}