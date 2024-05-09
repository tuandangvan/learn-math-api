import mongoose from "mongoose";
import Chapter from "../models/chapterModel";


const createLesson = async function (chapterId, lesson) {
    await checkChapterExist(chapterId);
    const newLesson = {
        _id: new mongoose.Types.ObjectId(),
        ...lesson
    };

    const chapter = await Chapter.updateOne({ _id: chapterId }, { $push: { lessons: newLesson } });
    return chapter;
}

const checkChapterExist = async function (chapterId) {
    //check chapter exist
    const chapterExist = await Chapter.findOne({ _id: chapterId, deleted: false });
    if (!chapterExist) {
        throw new Error("Chapter not found");
    }
    return chapterExist;
}

const editLesson = async function (chapterId, lessonId, lesson) {
    await checkChapterExist(chapterId);

    //check lesson exist
    const lessonExist = await Chapter.findOne({ _id: chapterId, "lessons._id": lessonId });
    if (!lessonExist) {
        throw new Error("Lesson not found");
    }
    const chapter = await Chapter.updateOne({ _id: chapterId, "lessons._id": lessonId },
        {
            $set: {
                "lessons.$.name": lesson.name,
                "lessons.$.description": lesson.description,
                "lessons.$.youtube": lesson.youtube,
                "lessons.$.documentPDF": lesson.documentPDF,
                "lessons.$.classId": lesson.classId,
                "lessons.$.chapterId": lesson.chapterId,
            }
        });
    return chapter;
}

const deleteLesson = async function (chapterId, lessonId) {
    await checkChapterExist(chapterId);

    //check lesson exist
    const lessonExist = await Chapter.findOne({ _id: chapterId, "lessons._id": lessonId });
    if (!lessonExist) {
        throw new Error("Lesson not found");
    }
    const chapter = await Chapter.updateOne({ _id: chapterId, "lessons._id": lessonId },
        {
            $set: {
                "lessons.$.deleted": true
            }
        });
    return chapter;
}

export const lessonService = {
    createLesson,
    editLesson,
    deleteLesson
}