import express from 'express';
import { accountController } from '../../controllers/accountController';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';

const router = express.Router();

//general
router.post('/register/student', accountController.createAccount);
router.post('/sign-in', accountController.signIn);
router.post('/refresh-token', accountController.refreshToken);
router.get('/list-teacher', accountController.getListTeacher);
router.get('/list-student', accountController.getListStudent);
router.put('/password', authencation, accountController.changePassword);
router.put('/profile', authencation, accountController.editAccount);
router.get('/profile/account', authencation, accountController.getProfile);
router.get('/list/student/:classId', authencation, permission([Role.ADMIN, Role.TEACHER]), accountController.getStudentOfClass);
router.get('/list/teacher/:classId', authencation, permission(Role.ADMIN), accountController.getTeacherOfClass);

//admin
router.post('/create/teacher', authencation, permission(Role.ADMIN), accountController.createAccount);
router.get('/manage-account', authencation, permission(Role.ADMIN), accountController.findAccountForAdmin);


export const accountRouter = router;