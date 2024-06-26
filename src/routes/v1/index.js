import express from "express";
import { StatusCodes } from "http-status-codes";
import { accountRouter } from "./accountRoute";
import { classRouter } from "./classRoute";
import { documentRouter } from "./documentRoute";
import { chapterRouter } from "./chapterRoute";
import { examRouter } from "./examRoute";
import { testRouter } from "./testRoute";
import { userRouter } from "./userRoute";
import { uploadRoute } from "./uploadRoute";

const router = express.Router();

router.get("/status", (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "API math-learning are ready to use!",
        code: StatusCodes.OK
    });
});

router.use("/auth", accountRouter);
router.use("/user", userRouter);
router.use("/class", classRouter);
router.use("/upload", documentRouter);
router.use("/chapter", chapterRouter);
router.use("/exam", examRouter);
router.use("/test", testRouter);
router.use('/image', uploadRoute)

export const APIs_V1 = router;
