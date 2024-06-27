import express from "express";
import authencation from "../../middlewares/authencationHandingMiddleware";
import permission from "../../middlewares/authorizationHandlingMiddelware";
import Role from "../../utils/enums";
import cloud from "../../upload/uploadCloudinary";
import { uploadController } from "../../controllers/uploadController";


const router = express.Router();
router.post("/single", authencation, permission([Role.ADMIN, Role.STUDENT, Role.TEACHER]), cloud.single('file'), uploadController.uploadSingle);
router.post("/multi", cloud.array('file', 5), uploadController.uploadMulti);

export const uploadRoute = router;
