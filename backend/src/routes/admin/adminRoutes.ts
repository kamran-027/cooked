import express from "express";
import { Request, Response } from "express";
import {
  addCook,
  addAdmin,
  createAdmin,
  updateCoook,
  deleteCook,
  getCookById,
  getCooks,
  deleteUser,
  getUsers,
} from "../../controllers/adminController";
import authMiddleware from "../../middlewares/authMiddleware";

const adminRouter = express.Router();
type AuthPayload = {
  userId: string;
  email: string;
  role?: "USER" | "ADMIN";
};

const requireAdmin = (req: Request, res: Response): boolean => {
  const authUser = (req as Request & { user?: AuthPayload }).user;
  if (!authUser || authUser.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden: admin access required" });
    return false;
  }
  return true;
};

// Create a new cook profile in the system.
adminRouter.post(
  "/addCook",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    try {
      const { name, email, rate, cuisine, description, image } = req.body;

      await addCook(name, email, rate, cuisine, description, image);

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
  },
);

// Update an existing cook profile by ID.
adminRouter.put(
  "/updateCook/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;

    try {
      const updatedCook = await updateCoook(id, req.body);

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
  },
);

// Delete a cook profile by ID.
adminRouter.post(
  "/deleteCook/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;

    try {
      const deletedCook = await deleteCook(id);
      return res.status(200).json({
        message: "Cook deleted successfully!",
        deletedCookId: deletedCook.id,
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
  },
);

// Retrieve a single cook profile by ID.
adminRouter.get(
  "/getCook/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
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
  },
);

// Retrieve all cook profiles.
adminRouter.get(
  "/getCooks",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
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
  },
);

// Delete a user account by ID.
adminRouter.post(
  "/deleteUser/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
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
  },
);

// Retrieve all registered users.
adminRouter.get(
  "/getUsers",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
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
  },
);

// Promote an existing user account to admin by user ID.
adminRouter.post(
  "/promoteAdmin/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;

    try {
      const updatedUser = await addAdmin(id);
      return res.status(200).json({
        message: "Admin added successfully!",
        userId: updatedUser.id,
        role: updatedUser.role,
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to add admin, please try again later.",
      });
    }
  },
);

// Public route to create an admin account directly.
adminRouter.post("/addAdmin", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newAdmin = await createAdmin(name, email, password);

    return res.status(201).json({
      message: "Admin created successfully!",
      userId: newAdmin.id,
      role: newAdmin.role,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create admin, please try again later.",
    });
  }
});

export default adminRouter;
