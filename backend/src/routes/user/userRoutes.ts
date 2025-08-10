import express from "express";
import { Request, Response } from "express";
import { addUser } from "../../controllers/userController";

const userRouter = express.Router();

userRouter.post("/addUser", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    await addUser(name, email, password);

    return res.json({
      message: "User created you bishhh!",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.json({
      message: "Cannot add user, check details again !!",
    });
  }
});

export default userRouter;
