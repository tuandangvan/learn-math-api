import { StatusCodes } from "http-status-codes";
import { sendError, sendSuccess } from "../utils/Api";

const uploadSingle = async (req, res, next) => {
  try {
    if (req.file) {
      sendSuccess(res, "Image loaded successfully!", { link: req.file.path });
    } else {
      sendError(res, "Can not upload photo!", "Can not upload photo!", 404);
    }
  } catch (error) {
    sendError(res, error.message, error.message, 408);
    next();
  }
};

const uploadMulti = async (req, res, next) => {
  try {
    if (req.files) {
      const images = req.files.map(item => ({ link: item.path }));

      sendSuccess(res, "Image loaded successfully!", images);
    } else {
      sendError(res, "Can not upload photo!", "Can not upload photo!", 404);
    }
  } catch (error) {
    sendError(res, error.message, error.message, 408);
    next();
  }
};

export const uploadController = {
  uploadSingle,
  uploadMulti,
};
