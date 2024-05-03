import Document from "../models/documentModel";
// import fs from 'fs';
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
            // data: fs.readFileSync(req.file.path)
        });
        await newPDF.save();
        // fs.unlinkSync(req.file.path); // Xóa tệp tạm sau khi lưu vào MongoDB
        sendSuccess(res, "Create document successfully", null);
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