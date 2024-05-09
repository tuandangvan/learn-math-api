import mongoose, { Schema } from "mongoose";

const chapterSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "Chưa cập nhật"
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
        bookId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        lessons: [
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
                    link: {
                        type: String,
                        default: ""
                    }
                },
                deleted: {
                    type: Boolean,
                    default: false
                },
                deleted: {
                    type: Boolean,
                    default: false
                },
            },
            {
                timestamps: true
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Chapter = mongoose.model("Chapter", chapterSchema);


export default Chapter;