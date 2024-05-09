import mongoose, { Schema } from "mongoose";

const lessonSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "Account"
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            default: null
        },
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
            default: null
        },
        description: {
            type: String,
            default: ""
        },
        youtube: {
            type: Array,
            default: [
                {
                    type: String,
                    default: ""
                }
            ]
        },
        documentPDF: {
            name: {
                type: String,
            },
            data: {
                type: Buffer,
            }
        },
        deleted: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

const Lesson = mongoose.model("Lesson", lessonSchema);


export default Lesson;