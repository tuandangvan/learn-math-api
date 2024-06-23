import express from 'express';
import { accountController } from '../../controllers/accountController';

const router = express.Router();

router.get('/teacher/:id', accountController.getTeacherById);
router.get('/student/:id', accountController.getStudentById);

export const userRouter = router;