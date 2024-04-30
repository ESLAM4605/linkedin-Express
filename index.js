import express from "express";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

import dotenv from "dotenv";
import userRouter from "./src/user/routers/usre.routes.js";
import postRouter from "./src/post/routes/posts.routes.js";
import skillRouter from "./src/skill/routes/skills.routes.js";
import experiencesRouter from "./src/experience/routes/experiences.routes.js";
import educationRouter from "./src/education/routes/education.router.js";
import { AppError } from "./src/utils/errorhandler.js";
import reactRouter from "./src/react/router/react.router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use(reactRouter);
app.use("/skills", skillRouter);
app.use("/experiences", experiencesRouter);
app.use("/educations", educationRouter);

app.all("*", (req, res, next) => {
  throw new AppError("Can't find this route", 400);
});
app.use((error, req, res, next) => {
  const { status, message, stack } = error;
  if (req.file)
    fs.unlinkSync(path.join(__dirname, "uploads", req.file.filename));

  let response;
  if (process.env.ENV === "production") {
    response = {
      message: "internal server error",
    };
  } else {
    response = {
      message,
      stack,
    };
  }

  res.status(status || 500).json(response);
});
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);
