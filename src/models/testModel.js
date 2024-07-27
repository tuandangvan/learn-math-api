import mongoose, { Schema } from "mongoose";

const testSchema = Schema(
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
        examId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Exam"
        },
        createBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Account"
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
        },
        answers: [
            {
                _id: false,
                sentenceNumber: {
                    type: Number,
                },
                typeQ: {
                    type: String,
                    enum: ["CHOICE", "FREETEXT"],
                },
                result: [
                    {
                        _id: false,
                        answer: {
                            type: String,
                            required: true,
                        },
                        correct: {
                            type: Boolean,
                            required: false,
                        },
                        point: {
                            type: Number,
                            required: false,
                            default: 0
                        }
                    }
                ],
            }
        ],
        correct: {
            type: Number
        },
        total: {
            type: Number
        },
        point: {
            type: Number
        },
        status: {
            type: String,
            required: true,
            enum: ["PENDING", "FINISHED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Test = mongoose.model("Test", testSchema);


export default Test;

