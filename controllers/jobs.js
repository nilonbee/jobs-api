const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  // we need to show all the jobs which are created by the user logged in...technically we don't need to expose other user's data to someone else
  const jobs = await Job.find({ createdBy: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ message: "SUCCESS", payload: jobs, length: jobs?.length });
};

const getJob = async (req, res) => {
  // const { jobId } = req.params;
  // const { userId } = req.user;
  // this is nice way to destructure this shit
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`There is no job with the id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ message: "SUCCESS", payload: job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Please input both company and positions...");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job is found with id of ${jobId}...`);
  }

  res.status(StatusCodes.OK).json({ message: "SUCCESS", payload: job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findByIdAndRemove(
    { _id: jobId, createdBy: userId },
    { new: true }
  );
  if (!job) {
    throw new NotFoundError(`No job found with the id of ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    message: "SUCCESS",
    payload: {
      msg: `the record with the id of ${jobId} is deleted...`,
      record: job,
    },
  });
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
