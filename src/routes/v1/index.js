import express from "express";
import { StatusCodes } from "http-status-codes";
import { accountRouter } from "./accountRoute";
import { classRouter } from "./classRoute";
import { documentRouter } from "./documentRoute";
import { chapterRouter } from "./chapterRoute";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "API math-learning are ready to use!",
        code: StatusCodes.OK
    });
});

router.use("/auth", accountRouter);
router.use("/class", classRouter);
router.use("/upload", documentRouter);
router.use("/chapter", chapterRouter);

export const APIs_V1 = router;
