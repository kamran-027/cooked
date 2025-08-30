import express from "express";
import { Request, Response } from "express";
import { addUser } from "../../controllers/userController";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCookById, getCooks } from "../../controllers/adminController";
import authMiddleware from "../../middlewares/authMiddleware";

dotenv.config();

const client = new PrismaClient();
const JWTSecret = process.env.JWT_SECRET;
const userRouter = express.Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all the required fields!",
      });
    }

    const newUser = await addUser(name, email, password);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWTSecret as string,
      { expiresIn: "8h" }
    );

    return res.status(201).json({
      message: "User added successfully!",
      userId: newUser.id,
      token,
    });
  } catch (error: unknown) {
    console.error("Error adding user:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to add user, please try again later.",
    });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password!",
      });
    }

    const user = await client.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: "User not found!" });

    //Comparing the provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWTSecret as string,
      { expiresIn: "8h" }
    );

    const userDetails = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return res.status(200).json({
      message: "Login successful!",
      user: userDetails,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Login failed, please try again later.",
    });
  }
});

userRouter.get(
  "/getCooks",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const cooks = await getCooks();
      return res.status(200).json(cooks);
    } catch (error) {
      console.error("Error fetching cooks:", error);
      return res.status(500).json({
        message: "Failed to fetch cooks, please try again later.",
      });
    }
  }
);

userRouter.get(
  "/getCookById/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const cook = await getCookById(id);

      return res.status(200).json(cook);
    } catch (error) {
      console.error("Error fetching cook:", error);
      return res.status(500).json({
        message: "Failed to fetch cook, please try again later.",
      });
    }
  }
);

export default userRouter;
