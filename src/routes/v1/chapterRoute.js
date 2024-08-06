
import express from 'express';
import authencation from '../../middlewares/authencationHandingMiddleware';
import permission from '../../middlewares/authorizationHandlingMiddelware';
import Role from '../../utils/enums';
import { chapterController } from '../../controllers/chapterController';
import { lessonController } from '../../controllers/lessonController';

const router = express.Router();

//chapter
router.post("/", authencation, permission([Role.ADMIN, Role.TEACHER]), chapterController.createChapter);
router.put("/:chapterId", authencation, permission([Role.ADMIN, Role.TEACHER]), chapterController.editChapter);
router.delete("/:chapterId", authencation, permission([Role.ADMIN, Role.TEACHER]), chapterController.deleteChapter);
router.get("/:chapterId", authencation, permission([Role.ADMIN, Role.TEACHER, Role.STUDENT]), chapterController.getChapter);
router.get("/list-chapter/:bookId", authencation, permission([Role.ADMIN, Role.TEACHER, Role.STUDENT]), chapterController.getListChapterByBookId);
router.get("/book/public/:classId", chapterController.getBookPublic);





//lesson
router.post("/:chapterId/lesson", authencation, permission([Role.ADMIN, Role.TEACHER]), lessonController.createLesson);
router.put("/:chapterId/lesson/:lessonId", authencation, permission([Role.ADMIN, Role.TEACHER]), lessonController.editLesson);
router.delete("/:chapterId/lesson/:lessonId", authencation, permission([Role.ADMIN, Role.TEACHER]), lessonController.deleteLesson);



export const chapterRouter = router;