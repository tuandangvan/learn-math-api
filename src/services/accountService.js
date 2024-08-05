import mongoose from 'mongoose';
import Account from '../models/accountModel.js';
import { compareSync, hashSync } from 'bcrypt';
import Role from '../utils/enums.js';

const createAccount = async function (account) {
    account.password = hashSync(account.password, 8);
    const newAccount = new Account({
        _id: new mongoose.Types.ObjectId(),
        ...account
    })
    return newAccount.save();
}

const getAccByEmailPhone = async function (account) {
    const acc = await Account.find({ $or: [{ email: account.email }, { phone: account.phone }] });
    if (acc.length > 0) {
        throw new Error('Account existed');
    }
    return acc;
}

const findByCredentials = async function ({ account, password }) {
    const acc = await Account.findOne({ $or: [{ email: account }, { phone: account }] });
    if (!acc) {
        throw new Error("Account not found");
    }
    const isPasswordMatch = compareSync(password, acc.password);
    if (!isPasswordMatch) {
        throw new Error("Wrong password");
    }
    acc.password = undefined;
    acc.refreshToken = undefined;
    return acc;
};

const findByIdAndUpdate = async function (accountId, refreshToken) {
    const accRefreshToken = await Account.findByIdAndUpdate(
        accountId,
        {
            refreshToken: refreshToken
        },
        {
            new: true
        });
    return accRefreshToken;
}
const findAccountByRefreshToken = async function (refreshToken) {
    const account = await Account.findOne({ refreshToken });
    return account;
}

const findListTeacher = async function () {
    const listTeacher = await Account.find({ role: Role.TEACHER }, "id firstName lastName address email phone avatar sex introduction");
    return listTeacher;
}

const findListStudent = async function () {
    const listStudent = await Account.find({ role: Role.TEACHER }, "id firstName lastName address email phone avatar sex introduction");
    return listStudent;
}

const findAccountByRole = async function (role, id) {
    const account = await Account.findOne({ role: role, _id: id });
    if (!account) {
        throw new Error("Account not found");
    }
    if (account.classId.length > 0 && role === Role.STUDENT) {
        //moi hoc sinh chi tham gia 1 lop hoc
        throw new Error("Each student is only allowed to attend 1 class");
    }
    return account;
}

const findAccountById = async function (accountId) {
    const account = await Account.findOne({ _id: accountId });
    account.password = undefined;
    account.refreshToken = undefined;
    account.deleted = undefined;
    return account;
}

const updateAccount = async function (accountId, data) {
    const accountUpdate = await Account.updateOne({ _id: accountId }, { $set: { ...data } });
    return accountUpdate;
}
const findStudentOfClass = async function (classId, page, limit) {
    const listStudent = await Account.find({ classId: classId, role: Role.STUDENT, deleted: false },
        { password: 0, refreshToken: 0, deleted: 0 }).skip((page - 1) * limit).limit(limit);
    const total = await Account.countDocuments({ classId: classId, role: Role.STUDENT, deleted: false });
    return { listStudent, total: total };
}

const findTeacherOfClass = async function (classId, page, limit) {
    const listTeacher = await Account.findOne({ classId: classId, role: Role.TEACHER, deleted: false },
        { password: 0, refreshToken: 0, deleted: 0 }).skip((page - 1) * limit).limit(limit);
    const total = await Account.countDocuments({ classId: classId, role: Role.TEACHER, deleted: false });
    return { listTeacher, total: total };
}

const findClassByAccountId = async function (accountId) {
    const account = await Account.findOne({ _id: accountId });
    return account.classId;
}

const getClassByAccountId = async function (accountId) {
    const account = await Account.findOne({ _id: accountId }).populate({
        path: 'classId',
        model: 'Class'
    });
    if (account.role == Role.STUDENT) {
        return account.classId[0];
    }
    return account.classId;
}

const findAccountForAdmin = async function (role, page, limit) {
    const account = await Account.find({ role: role }, { password: 0, refreshToken: 0 }).skip((page - 1) * limit).limit(limit);
    const accounts = account.map(account => {
        return {
            accountId: account._id,
            ...account.toObject(),
            _id: undefined // Loại bỏ trường _id
        };
    });
    const total = await Account.countDocuments({ role: role });
    return { accounts, total };
}

// const findStudentOfClass = async function (classId) {


// }



export const accountService = {
    createAccount,
    getAccByEmailPhone,
    findByCredentials,
    findByIdAndUpdate,
    findAccountByRefreshToken,
    findListTeacher,
    findListStudent,
    findAccountByRole,
    findAccountById,
    updateAccount,
    findStudentOfClass,
    findTeacherOfClass,
    findClassByAccountId,
    getClassByAccountId,
    findAccountForAdmin
}