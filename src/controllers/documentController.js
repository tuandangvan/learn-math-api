import { env } from "../config/environment";
import Document from "../models/documentModel";
import { sendError, sendSuccess } from "../utils/Api";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";


const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const createDocument = async (req, res, next) => {
    try {
        if (req.file.size > MAX_SIZE) {
            return sendError(res, "File size exceeds the limit of 15MB", null, StatusCodes.UNPROCESSABLE_ENTITY);
        }
        const newPDF = new Document({
            _id: new mongoose.Types.ObjectId(),
            name: req.file.originalname,
            data: req.file.buffer
        });
        await newPDF.save();

        const HOSTING = env.HOSTING || "https://learn-math-api.vercel.app/api/v1";

        sendSuccess(res, "Create document successfully", {
            link: HOSTING + `/upload/document/${newPDF._id}`
        });
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

const getDocument = async (req, res, next) => {
    try {
        const pdf = await Document.findById(req.params.documentId);
        if (!pdf) {
            return res.status(404).send('PDF not found');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdf.name}"`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.send(pdf.data);
    } catch (error) {
        sendError(res, error.message, error.stack, StatusCodes.UNPROCESSABLE_ENTITY);
    }
}

export const documentController = {
    createDocument,
    getDocument
}