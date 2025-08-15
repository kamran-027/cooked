import express from "express";
import { Request, Response } from "express";
import {
  addCook,
  updateCoook,
  deleteCook,
  getCookById,
  getCooks,
  deleteUser,
  getUsers,
} from "../../controllers/adminController";

const adminRouter = express.Router();

adminRouter.post("/addCook", async (req: Request, res: Response) => {
  try {
    const { name, rate } = req.body;

    await addCook(name, rate);

    return res.status(201).json({
      message: "Cook added successfully!",
    });
  } catch (error) {
    console.error("Error adding cook:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to add cook, please try again later.",
    });
  }
});

adminRouter.put("/updateCook/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedCook = await updateCoook(
      id,
      req?.body?.name ?? undefined,
      req?.body?.rate ?? undefined
    );
    return res.status(200).json({
      message: "Cook updated successfully!",
      cook: updatedCook,
    });
  } catch (error) {
    console.error("Error updating cook:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update cook, please try again later.",
    });
  }
});

adminRouter.post("/deleteCook/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCook = await deleteCook(id);
    return res.status(200).json({
      message: "Cook deleted successfully!",
      deleteCookId: deletedCook.id,
    });
  } catch (error) {
    console.error("Error deleting cook:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete cook, please try again later.",
    });
  }
});

adminRouter.get("/getCook/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cook = await getCookById(id);

    if (!cook) {
      return res.status(404).json({ message: "Cook not found!" });
    }

    return res.status(200).json(cook);
  } catch (error) {
    console.error("Error fetching cook:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch cook, please try again later.",
    });
  }
});

adminRouter.get("/getCooks", async (req: Request, res: Response) => {
  try {
    const cooks = await getCooks();
    return res.status(200).json(cooks);
  } catch (error) {
    console.error("Error fetching cooks:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch cooks, please try again later.",
    });
  }
});

adminRouter.post("/deleteUser/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUser(id);
    return res.status(200).json({
      message: "User deleted successfully!",
      userId: deletedUser.id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete user, please try again later.",
    });
  }
});

adminRouter.get("/getUsers", async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch users, please try again later.",
    });
  }
});

export default adminRouter;
