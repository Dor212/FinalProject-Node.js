import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const { SECRET_KEY } = process.env;

const generateToken = (user) => {
  const { id, isAdmin, isBusiness } = user;
  const payloadData = { id, isAdmin, isBusiness };
  const token = jwt.sign(payloadData, SECRET_KEY, { expiresIn: "1d" });
  return token;
};

const verifyToken = (tokenFromClient) => {
  try {
    const userData = jwt.verify(tokenFromClient, SECRET_KEY);
    return userData;
  } catch (err) {
    return null;
  }
};

export { generateToken, verifyToken };
