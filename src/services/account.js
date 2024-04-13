import mongoose from 'mongoose';
import Account from '../models/account.js';
import { compareSync, hashSync } from 'bcrypt';

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
    const acc = await Account.findOne({ $or: [{ email: account }, { phone: account }]});
    if (!acc) {
        throw new Error("Account not found");
    }
    const isPasswordMatch = compareSync(password, acc.password);
    if (!isPasswordMatch) {
        throw new Error("Wrong password");
    }
    acc.password = undefined;
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

export const accountService = {
    createAccount,
    getAccByEmailPhone,
    findByCredentials,
    findByIdAndUpdate
}