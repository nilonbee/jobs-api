const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong...please try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  // this above 4 lines of code can cover the below if statement so i'm free to comment this out
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // This is validation error
  //   {
  //     "err": {
  //         "errors": {
  //             "password": {
  //                 "name": "ValidatorError",
  //                 "message": "Please enter your password",
  //                 "properties": {
  //                     "message": "Please enter your password",
  //                     "type": "required",
  //                     "path": "password"
  //                 },
  //                 "kind": "required",
  //                 "path": "password"
  //             },
  //             "username": {
  //                 "name": "ValidatorError",
  //                 "message": "Please provide a Email",
  //                 "properties": {
  //                     "message": "Please provide a Email",
  //                     "type": "required",
  //                     "path": "username"
  //                 },
  //                 "kind": "required",
  //                 "path": "username"
  //             }
  //         },
  //         "_message": "User validation failed",
  //         "name": "ValidationError",
  //         "message": "User validation failed: password: Please enter your password, username: Please provide a Email"
  //     }
  // }

  //this is cast error
  // Cast errors usually occors when id of a params is wrong(delete or add several to existing id)
  // cast error
  //   "err": {
  //     "stringValue": "\"64d100e903004f09c0f3cf2b33sc\"",
  //     "valueType": "string",
  //     "kind": "ObjectId",
  //     "value": "64d100e903004f09c0f3cf2b33sc",
  //     "path": "_id",
  //     "reason": {},
  //     "name": "CastError",
  //     "message": "Cast to ObjectId failed for value \"64d100e903004f09c0f3cf2b33sc\" (type string) at path \"_id\" for model \"Job\""
  // }

  if (err.name === "ValidationError") {
    customError.msg = `${Object.values(err.errors)
      .map((item) => item.message)
      .join(",")}`;
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    (customError.msg = `The value entered for the ${Object.keys(
      err.keyValue
    )} is duplicated please choose another value...`),
      (customError.statusCode = 400);
  }

  if (err.name === "CastError") {
    customError.msg = `no record found with the id: ${err.value}`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
