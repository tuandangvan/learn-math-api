import mongoose, { Schema } from "mongoose";

const examSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
            type: String,
            required: true,
            enum: ["LESSON", "TEST", "EXAM"],
        },
        classId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Class"
        },
        createBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Account"
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        time: {
            type: Number,
            required: true, //unit: minutes
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        view: {
            type: Number,
            default: 0,
        },
        numberOfAttempts: {
            type: Number,
            required: true,
            default: 0
        },
        questions: [
            {
                _id: false,
                sentenceNumber: {
                    type: Number,
                    required: true,
                },
                typeQ: {
                    type: String,
                    required: true,
                    enum: ["CHOICE", "FREETEXT"],
                },
                content: {
                    type: String,
                    required: false,
                },
                images: [
                    {
                        type: String,
                    }
                ],
                answers: [
                    {
                        _id: false,
                        content: {
                            type: String,
                            required: false,
                        },
                        correct: {
                            type: String,
                            required: true,
                        },
                        point: {
                            type: Number,
                            required: true,
                        }
                    }
                ],
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

const Exam = mongoose.model("Exam", examSchema);


export default Exam;

