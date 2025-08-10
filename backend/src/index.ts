import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user/userRoutes";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

//Adding Middleware for parsing JSON bodies
app.use(express.json());

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
