import mongoose from "mongoose";
import Chapter from "../models/chapterModel"
import Class from "../models/classModel";
import checkClassExist from "./classService";


const createChapter = async function (chapter) {
    const newChapter = new Chapter({
        _id: new mongoose.Types.ObjectId(),
        ...chapter
    });

    await checkClassExist(chapter.classId);

    await Class.updateOne({ _id: chapter.classId, "books._id": chapter.bookId }, {
        $push: {
            "books.$.chapterIds": newChapter._id
        }
    });
    return newChapter.save();
}

const checkChapterExist = async function (chapterId) {
    //check chapter exist
    const chapterExist = await Chapter.findOne({ _id: chapterId, deleted: false });
    if (!chapterExist) {
        throw new Error("Chapter not found");
    }
    return chapterExist;
}

const editChapter = async function (chapterId, chapter) {
    await checkChapterExist(chapterId);
    const chapterEdit = await Chapter.updateOne(
        { _id: chapterId },
        {
            $set: {
                name: chapter.name,
                description: chapter.description,
            }
        });
    return chapterEdit
}

const deleteChapter = async function (chapterId) {
    await checkChapterExist(chapterId);
    const chapterEdit = await Chapter.updateOne(
        { _id: chapterId },
        {
            $set: {
                deleted: true
            }
        });
    return chapterEdit
}

const findChapter = async function (chapterId) {
    await checkChapterExist(chapterId);
    const chapter = await Chapter.findOne({ _id: chapterId });
    return chapter;
}

const findBook = async function (bookId) {
    const book = await Chapter.findOne({ bookId: bookId, deleted: false })
        .populate("teacherId", "firstName lastName avatar introduction email phone")
        .populate("classId", "name description image");
    return book;
}

export const chapterService = {
    createChapter,
    editChapter,
    deleteChapter,
    findChapter,
    findBook
}