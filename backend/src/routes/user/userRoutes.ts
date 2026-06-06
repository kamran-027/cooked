import express from "express";
import { Request, Response } from "express";
import { addUser } from "../../controllers/userController.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getCookById, getCooks } from "../../controllers/adminController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { z } from "zod";
import { getDurationInHours } from "../../utils/time.js";

dotenv.config();

const client = new PrismaClient();
const JWTSecret = process.env.JWT_SECRET;
const userRouter = express.Router();

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createBookingSchema = z.object({
  cookId: z.string().uuid(),
  availabilityId: z.string().uuid(),
  notes: z.string().optional(),
});

const bookingIdParamsSchema = z.object({
  id: z.string().uuid(),
});

type AuthPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
};

// Register a new user and return an auth token.
userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.issues,
      });
    }

    const { name, email, password } = parsed.data;
    const newUser = await addUser(name, email, password);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWTSecret as string,
      { expiresIn: "8h" },
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

// Authenticate a user and issue a login token.
userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsed.error.issues,
      });
    }

    const { email, password } = parsed.data;
    const user = await client.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: "User not found!" });

    //Comparing the provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid password!" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWTSecret as string,
      { expiresIn: "8h" },
    );

    const userDetails = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
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

// Fetch all cooks for authenticated users.
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
  },
);

// Fetch a specific cook by ID for authenticated users.
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
  },
);

// Return the currently authenticated user profile.
userRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const authUser = (req as Request & { user?: AuthPayload }).user; //Manual casting to include user from authMiddleware
    if (!authUser?.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await client.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      message: "Failed to fetch current user, please try again later.",
    });
  }
});



// Fetch all availability slots for a specific cook
userRouter.get(
  "/cooks/:id/availability",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const slots = await client.cookAvailability.findMany({
        where: {
          cookId: id,
        },
        orderBy: { date: "asc" },
      });
      return res.status(200).json(slots);
    } catch (error) {
      console.error("Error fetching cook availability:", error);
      return res.status(500).json({
        message: "Failed to fetch cook availability, please try again later.",
      });
    }
  },
);

// Create a booking for the currently authenticated user.
userRouter.post(
  "/bookings",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as Request & { user?: AuthPayload }).user;
      if (!authUser?.userId) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const parsed = createBookingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: parsed.error.issues,
        });
      }

      const { cookId, availabilityId, notes } = parsed.data;

      // 1. Verify availability slot
      const slot = await client.cookAvailability.findUnique({
        where: { id: availabilityId },
      });

      if (!slot) {
        return res.status(404).json({ message: "Availability slot not found!" });
      }

      if (slot.cookId !== cookId) {
        return res.status(400).json({ message: "Slot does not belong to this cook!" });
      }

      if (slot.isBooked) {
        return res.status(400).json({ message: "This timeslot is already booked!" });
      }

      // 2. Fetch cook rate
      const cook = await client.cook.findUnique({
        where: { id: cookId },
      });

      if (!cook) {
        return res.status(404).json({ message: "Cook not found!" });
      }

      // 3. Calculate price
      const durationHours = getDurationInHours(slot.startTime, slot.endTime);
      const totalPrice = Math.round(cook.rate * durationHours);

      // 4. Perform transaction
      const booking = await client.$transaction(async (tx) => {
        // Double check slot status inside transaction to prevent race conditions
        const freshSlot = await tx.cookAvailability.findUnique({
          where: { id: availabilityId },
        });
        if (!freshSlot || freshSlot.isBooked) {
          throw new Error("This slot was just booked by another user!");
        }

        // Mark slot as booked
        await tx.cookAvailability.update({
          where: { id: availabilityId },
          data: { isBooked: true },
        });

        // Create booking record
        return await tx.booking.create({
          data: {
            userId: authUser.userId,
            cookId,
            availabilityId,
            status: "BOOKED",
            notes: notes || null,
            totalPrice,
          },
        });
      });

      return res.status(201).json({
        message: "Booking created successfully!",
        booking,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to create booking, please try again later.",
      });
    }
  },
);

// Retrieve all bookings for the currently authenticated user.
userRouter.get(
  "/bookings",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as Request & { user?: AuthPayload }).user;
      if (!authUser?.userId) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const bookings = await client.booking.findMany({
        where: { userId: authUser.userId },
        include: {
          cook: true,
          availability: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({
        message: "Failed to fetch bookings, please try again later.",
      });
    }
  },
);

// Delete/Cancel a booking by ID for the currently authenticated user.
userRouter.delete(
  "/bookings/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authUser = (req as Request & { user?: AuthPayload }).user;
      if (!authUser?.userId) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const parsedParams = bookingIdParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return res.status(400).json({
          message: "Invalid booking id",
          errors: parsedParams.error.issues,
        });
      }

      const booking = await client.booking.findUnique({
        where: { id: parsedParams.data.id },
      });

      if (!booking || booking.userId !== authUser.userId) {
        return res.status(404).json({ message: "Booking not found!" });
      }

      if (booking.status === "CANCELLED") {
        return res.status(400).json({ message: "Booking is already cancelled!" });
      }

      // Perform transaction to set booking to CANCELLED and free slot
      await client.$transaction([
        client.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELLED" },
        }),
        client.cookAvailability.update({
          where: { id: booking.availabilityId },
          data: { isBooked: false },
        }),
      ]);

      return res.status(200).json({ message: "Booking cancelled successfully!" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return res.status(500).json({
        message: "Failed to cancel booking, please try again later.",
      });
    }
  },
);

export default userRouter;
