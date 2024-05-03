import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { classController } from '../../controllers/classController';


const router = express.Router();
//general
router.get('/list-class', classController.getListClass);


//admin
router.post('/', authencation, permission(Role.ADMIN), classController.createClass);
router.put('/:classId', authencation, permission(Role.ADMIN), classController.editClass);


//teacher
router.put('/:classId/teacher/in', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.addTeacher);
router.put('/:classId/teacher/out', authencation, permission([Role.TEACHER, Role.ADMIN]), classController.removeTeacher);


//student
router.put('/:classId/student/in', authencation, permission([Role.STUDENT, Role.TEACHER, Role.ADMIN]), classController.addStudent);
router.put('/:classId/student/out', authencation, permission([Role.STUDENT, Role.TEACHER, Role.ADMIN]), classController.removeStudent);


export const classRouter = router;