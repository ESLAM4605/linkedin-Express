import express from "express";
import dotenv from "dotenv";
import userRouter from "./src/user/routers/usre.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  throw new AppError("Can't find this route", 400);
});
app.use((error, req, res, next) => {
  console.log(error);
  const { status, message, stack } = error;
  res.status(status || 500).json({
    message,
    stack,
  });
});
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);
