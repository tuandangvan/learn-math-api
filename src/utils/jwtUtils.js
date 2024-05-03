import jwt from 'jsonwebtoken';
import { env } from "../config/environment.js";
const generateAuthToken = async function (account) {
  const token = await jwt.sign(
    {
      id: account._id,
      email: account.email,
      role: account.role,
      isActive: account.isActive
    },
    env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};
const generateRefreshToken = async function (account) {
  const token = await jwt.sign(
    {
      id: account._id,
      email: account.email,
      role: account.role,
      isActive: account.isActive
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};
export const jwtService = {
  generateAuthToken,
  generateRefreshToken
};
