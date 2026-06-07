import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();

export const addCook = async (
  name: string,
  email: string,
  rate: number,
  cuisine: string,
  description: string,
  image: string,
  coverImage?: string,
) => {
  if (!name || !email || !rate) {
    throw new Error("Please provide all the required fields!");
  }

  const existingCook = await client.cook.findUnique({
    where: { email },
  });

  if (existingCook) {
    throw new Error("Cook with this email already exists!");
  }

  const newCook = await client.cook.create({
    data: {
      name,
      rate,
      email,
      cuisine,
      description,
      image,
      coverImage,
      updatedAt: new Date(),
    },
  });

  return newCook;
};

export const updateCoook = async (id: string, body: any) => {
  if (!id) {
    throw new Error("Please provide cook Id!");
  }

  const { name, email, rate, cuisine, description, image, coverImage } = body;

  const cookExists = await client.cook.findUnique({
    where: { id },
  });

  if (!cookExists) {
    throw new Error("Cook not found!");
  }

  const updatedCook = await client.cook.update({
    where: { id },
    data: {
      name: name || cookExists.name,
      rate: rate || cookExists.rate,
      email: email || cookExists.email,
      cuisine: cuisine || cookExists.cuisine,
      description: description || cookExists.description,
      image: image || cookExists.image,
      coverImage: coverImage || cookExists.coverImage,
      updatedAt: new Date(),
    },
  });

  return updatedCook;
};

export const deleteCook = async (id: string) => {
  if (!id) {
    throw new Error("Please provide a valid cook ID!");
  }

  const cookExists = await client.cook.findUnique({
    where: { id },
  });

  if (!cookExists) {
    throw new Error("Cook not found!");
  }

  const deletedCook = await client.cook.delete({
    where: { id },
  });

  return deletedCook;
};

export const getCooks = async () => {
  try {
    const cooks = await client.cook.findMany({
      include: {
        reviews: true,
      },
    });

    const cooksWithRatings = cooks.map((cook) => {
      const reviews = cook.reviews || [];
      const reviewCount = reviews.length;
      const averageRating =
        reviewCount > 0
          ? parseFloat(
              (
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              ).toFixed(1),
            )
          : 0;

      // Omit full reviews list to save response size in index query
      const { reviews: _, ...rest } = cook;
      return {
        ...rest,
        averageRating,
        reviewCount,
      };
    });

    return cooksWithRatings;
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch cooks, please try again later.",
    };
  }
};

export const getCookById = async (id: string) => {
  if (!id) {
    throw new Error("Please provide a valid cook ID!");
  }

  const cook = await client.cook.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!cook) {
    throw new Error("Cook not found!");
  }

  const reviews = cook.reviews || [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(
            1,
          ),
        )
      : 0;

  return {
    ...cook,
    averageRating,
    reviewCount,
  };
};

export const deleteUser = async (id: string) => {
  if (!id) {
    throw new Error("Please provide a valid user ID!");
  }

  const userExists = await client.user.findUnique({
    where: { id },
  });

  if (!userExists) {
    throw new Error("User not found!");
  }

  const deletedUser = await client.user.delete({
    where: { id },
  });

  return deletedUser;
};

export const getUsers = async () => {
  const users = await client.user.findMany();
  return users;
};

export const addAdmin = async (id: string) => {
  if (!id) {
    throw new Error("Please provide a valid user ID!");
  }

  const userExists = await client.user.findUnique({
    where: { id },
  });

  if (!userExists) {
    throw new Error("User not found!");
  }

  if (userExists.role === "ADMIN") {
    throw new Error("User is already an admin!");
  }

  const updatedUser = await client.user.update({
    where: { id },
    data: { role: "ADMIN", updatedAt: new Date() },
  });

  return updatedUser;
};

export const createAdmin = async (
  name: string,
  email: string,
  password: string,
) => {
  if (!name || !email || !password) {
    throw new Error("Please provide name, email, and password!");
  }

  const emailExists = await client.user.findUnique({
    where: { email },
  });

  if (emailExists) {
    throw new Error("Email already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return adminUser;
};

export const addAvailability = async (
  cookId: string,
  dateStr: string,
  startTime: string,
  endTime: string,
) => {
  if (!cookId || !dateStr || !startTime || !endTime) {
    throw new Error("Please provide cookId, date, startTime, and endTime!");
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format!");
  }

  const cook = await client.cook.findUnique({ where: { id: cookId } });
  if (!cook) {
    throw new Error("Cook not found!");
  }

  const availability = await client.cookAvailability.create({
    data: {
      cookId,
      date,
      startTime,
      endTime,
      isBooked: false,
    },
  });

  return availability;
};

export const getAvailabilityByCookId = async (cookId: string) => {
  if (!cookId) {
    throw new Error("Please provide cookId!");
  }
  const availabilities = await client.cookAvailability.findMany({
    where: { cookId },
    orderBy: { date: "asc" },
  });
  return availabilities;
};

export const deleteAvailabilitySlot = async (id: string) => {
  if (!id) {
    throw new Error("Please provide slot ID!");
  }
  const slot = await client.cookAvailability.findUnique({
    where: { id },
  });
  if (!slot) {
    throw new Error("Slot not found!");
  }
  if (slot.isBooked) {
    throw new Error("Cannot delete a slot that is already booked!");
  }
  const deleted = await client.cookAvailability.delete({
    where: { id },
  });
  return deleted;
};

