import mongoose, { Schema } from "mongoose";

const classSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        teacherIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Account"
            }
        ],
        studentIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Account"
            }
        ],
        description: {
            type: String,
            default: "Chưa cập nhật"
        },
        books: [{
            _id: mongoose.Schema.Types.ObjectId,
            type: {
                type: String,
                required: true,
                enum: ["TEXTBOOK", "THINKING", "ADVANCED", "FMO"],
                default: "TEXTBOOK",
                unique: true,
            },
            name: {
                type: String,
                default: "Toán sách giáo khoa"
            },
            description: {
                type: String,
                default: "Chưa cập nhật"
            },
            image: {
                type: String,
                default: "Chưa cập nhật"
            },
            chapterIds: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Chapter"
                }
            ]

        }],
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Class = mongoose.model("Class", classSchema);


export default Class;