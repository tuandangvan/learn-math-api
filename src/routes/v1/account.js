import express from 'express';
import { accountController } from '../../controllers/account';

const router = express.Router();

router.post('/register/student', accountController.createAccount);
router.post('/sign-in', accountController.signIn);

export const studentRouter = router;