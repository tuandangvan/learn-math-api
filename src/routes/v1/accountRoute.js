import express from 'express';
import { accountController } from '../../controllers/accountController';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';

const router = express.Router();

//general
router.post('/register/student', accountController.createAccount);
router.post('/sign-in', accountController.signIn);

//admin
router.post('/create/teacher', authencation, permission(Role.ADMIN), accountController.createAccount);

export const accountRouter = router;