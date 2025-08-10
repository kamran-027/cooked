import express from "express";

const userRouter = express.Router();

userRouter.get("/userGet", (req, res) => {
  return res.json({
    message: "You have hit the user router!!",
  });
});

export default userRouter;
