import express from "express";
import { Request, Response } from "express";
import {
  addCook,
  updateCoook,
  deleteCook,
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
      Number(id),
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
    const deletedCook = await deleteCook(Number(id));
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

export default adminRouter;
