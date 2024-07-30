import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { testController } from '../../controllers/testController';

const router = express.Router();

router.post("/:examId", authencation, permission(Role.STUDENT), testController.createTest);
router.put("/:examId", authencation, permission(Role.STUDENT), testController.pushAnswer);

// router.post("/:examId", authencation, permission(Role.STUDENT), testController.takeExam);
router.get("/:examId", authencation, permission(Role.STUDENT), testController.getTestsExam);
router.get("/:testId/detail", authencation, permission(Role.STUDENT), testController.getTestById);
router.get("/:testId/pending", authencation, permission(Role.STUDENT), testController.getTestByIdPending);


export const testRouter = router;