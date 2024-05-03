import mongoose, { Schema } from "mongoose";
import Role from "../utils/enums";

const accountSchema = Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: [Role.ADMIN, Role.TEACHER, Role.STUDENT],
            default: Role.STUDENT
        },
        isActive: {
            type: Boolean,
            default: false
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        sex: {
            type: String,
        },
        avatar: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            required: true,
        },
        classId: {
            type: String,
        },
        introduction: {
            type: String,
            default: ""
        },
        refreshToken: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

const Account = mongoose.model("Account", accountSchema);


export default Account;


// import mongoose, { Schema } from "mongoose";

// const accountSchema = mongoose.Schema(
//     {
//         _id: mongoose.Schema.Types.ObjectId,
//         email: {
//             type: String,
//             required: true,
//             trim: true,
//             unique: true
//         },
//         password: {
//             type: String,
//             required: true
//         },
//         role: {
//             type: String,
//             required: true,
//             enum: [Role.ADMIN, Role.TEACHER, Role.STUDENT],
//             default: Role.STUDENT
//         },
//         isActive: {
//             type: Boolean,
//             default: false
//         },
//         firstName: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         lastName: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         sex: {
//             type: String,
//         },
//         avatar: {
//             type: String,
//             default: ""
//         },
//         phone: {
//             type: String,
//             required: true,
//         },
//         address: {
//             type: String,
//             required: true,
//         },
//         refreshToken: {
//             type: String,
//             default: ""
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// const Account = mongoose.model("Account", accountSchema);
// export default Account;


