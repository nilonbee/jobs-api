require("dotenv").config();
require("express-async-errors");
const express = require("express");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const app = express();
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages for security
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 100, // limit each IP address to number of request per windowMs
  })
);
app.use(helmet());
app.use(xss());
app.use(cors());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.get("/", (req, res) => {
  res.send("JOBS_API");
});

//middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      `App ls listening on port ${port}...`;
    });
  } catch (error) {
    console.log(error);
  }
};

start();
