const User = require("../models/User");
const { StatusCodes, CREATED } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  // const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", {
  //   expiresIn: "30d",
  // });-
  const token =  user?.createToken();
  res
    .status(StatusCodes.CREATED)
    // .json({ user: { name: user.getName() }, message: "SUCCESS", token });
    .json({ user: { name: user?.name }, message: "SUCCESS", token });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError(
      "Please provide username and password to sign-in..."
    );
  }
  const user = await User.findOne({ username });
  // Check weather there is a registered user or not
  // If user exist we can proceed to create a token

  // compare password and username
  if (!user) {
    throw new UnauthenticatedError("User has't been registered...");
  }

  // let's see the password is correct
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new UnauthenticatedError("Invalid Credentials...");
  }

  const token = user.createToken();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token: token, message: "SUCCESS" });
};

module.exports = {
  login,
  register,
};
