import mongoose, { Schema } from "mongoose";

const documentSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
        },
        data: {
            type: Buffer,
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

const Document = mongoose.model("Document", documentSchema);


export default Document;