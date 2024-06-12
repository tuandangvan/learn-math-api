import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { examController } from '../../controllers/examController';

const router = express.Router();

router.post('/', authencation, permission([Role.ADMIN, Role.TEACHER]), examController.createExam);
router.put('/:examId', authencation, permission([Role.ADMIN, Role.TEACHER]), examController.editExam);

export const examRouter = router;