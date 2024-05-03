import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import multer from 'multer';
import { documentController } from '../../controllers/documentController';

const upload = multer({ dest: 'uploads' });
const router = express.Router();
//general
router.post("/document", authencation, permission([Role.ADMIN, Role.TEACHER]), upload.single('file'), documentController.createDocument);
router.get("/document/:documentId", documentController.getDocument);

export const documentRouter = router;