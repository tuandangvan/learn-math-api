import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { testController } from '../../controllers/testController';

const router = express.Router();

router.post("/:examId", authencation, permission(Role.STUDENT), testController.takeExam)


export const testRouter = router;