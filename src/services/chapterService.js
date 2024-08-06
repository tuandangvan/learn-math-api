import mongoose from "mongoose";
import Chapter from "../models/chapterModel"
import Class from "../models/classModel";
import checkClassExist from "./classService";
import Exam from "../models/examModel";


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
    const book = await Chapter.find({ bookId: bookId, deleted: false })
        .populate("teacherId", "firstName lastName avatar introduction email phone")
        .populate("classId", "name description image");
    return book;
}

const findBookPublic = async function (classId) {
    const bookId = await Chapter.findOne({ classId: classId });
    const book = await Chapter.find({ bookId: bookId.bookId, deleted: false })
        .populate("teacherId", "firstName lastName avatar introduction email phone")
        .populate("classId", "name description image");

    // doi _id thanh bookId
    const bookRS = book.map(b => {
        return {
            chapterId: b._id,
            ...b.toObject(),
            _id: undefined,
        }
    })
    return bookRS;
}

const addExamToLesson = async function (chapterId, lessonId, examId) {
    const chapter = await Chapter.findOne({ _id: chapterId, "lessons._id": lessonId });
    if (!chapter) {
        await Exam.deleteOne({ _id: examId });
        throw new Error("Chapter or lesson not found");
    }

    const addExam = await Chapter.updateOne(
        { _id: chapterId, "lessons._id": lessonId },
        { $push: { "lessons.$.examIds": examId } });
    return addExam;
}

const findListChapterByBook = async function (bookId) {
    const chapters = await Chapter.find({ bookId: bookId, deleted: false })

    const listChapter = chapters.map(chapter => {
        return {
            chapterId: chapter._id,
            ...chapter.toObject(),
            _id: undefined,
        }
    })
    return listChapter;
}

const findChapterById = async function (chapterId) {
    const chapter = await Chapter.findOne({ _id: chapterId, deleted: false });
    if (!chapter) {
        throw new Error("Chapter not found");
    }
    return {
        chapterId: chapterId,
        ...chapter.toObject(),
        _id: undefined,
    };
}

export const chapterService = {
    createChapter,
    editChapter,
    deleteChapter,
    findChapter,
    findBook,
    addExamToLesson,
    findListChapterByBook,
    findChapterById,
    findBookPublic
}