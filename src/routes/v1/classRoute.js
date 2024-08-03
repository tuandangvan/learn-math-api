import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { classController } from '../../controllers/classController';
import { chapterController } from '../../controllers/chapterController';


const router = express.Router();
//general
router.get('/list-class', classController.getListClass);
router.get('/one-class/:classId', classController.getClass);
router.get("/book/:bookId", authencation, permission([Role.ADMIN, Role.TEACHER]), chapterController.getBook);
router.get("/book/chapter/:classId", authencation, permission([Role.ADMIN, Role.TEACHER]), classController.getBook_Chapter_Lesson);

//admin
router.post('/', authencation, permission(Role.ADMIN), classController.createClass);
router.put('/:classId', authencation, permission(Role.ADMIN), classController.editClass);


//teacher
router.put('/:classId/teacher/in', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.addTeacher);
router.put('/:classId/teacher/out', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.removeTeacher);
router.post('/:classId/book', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.addBook);
router.put('/:classId/book/:bookId', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.editBook);



//student
router.put('/:classId/student/in', authencation, permission([Role.STUDENT, Role.TEACHER, Role.ADMIN]), classController.addStudent);
router.put('/:classId/student/out', authencation, permission([Role.STUDENT, Role.TEACHER, Role.ADMIN]), classController.removeStudent);
router.get('/my-class', authencation, permission(Role.STUDENT), classController.getClassByAccountId);


export const classRouter = router;