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
        textbook:
            [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Lesson"
                }
            ],
        thinking: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ],
        advanced: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ],
        FMO: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ],
        description: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

const Class = mongoose.model("Class", classSchema);


export default Class;