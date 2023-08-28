const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log(token);
    throw new UnauthenticatedError("User is not Authenticated...");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload?.userId,
      name: payload?.name,
    };
    console.log("payload...", payload.userId);
    next();
  } catch (error) {
    throw new UnauthenticatedError("User is not Authenticated...");
  }
};

module.exports = auth;
