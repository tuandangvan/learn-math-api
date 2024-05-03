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
        youtube: {
            type: Array,
            default: [
                {
                    type: String,
                    default: ""
                }
            ]
        }

    },
    {
        timestamps: true
    }
);

const Lesson = mongoose.model("Lesson", lessonSchema);


export default Lesson;