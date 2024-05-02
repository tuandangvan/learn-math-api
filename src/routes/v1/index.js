import express from "express";
import { StatusCodes } from "http-status-codes";
import { accountRouter } from "./accountRoute";

const router = express.Router();

router.get("/status", (req, res) => {
    res.status(StatusCodes.OK).json({
        message: "API math-learning are ready to use!",
        code: StatusCodes.OK
    });
});

router.use("/auth", accountRouter);

export const APIs_V1 = router;
