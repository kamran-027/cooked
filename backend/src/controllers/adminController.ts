import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const addCook = async (
  name: string,
  email: string,
  rate: number,
  cuisine: string,
  description: string,
  image: string
) => {
  if (!name || !email || !rate) {
    throw new Error("Please provide all the required fields!");
  }

  const newCook = await client.cook.create({
    data: {
      name,
      rate,
      email,
      cuisine,
      description,
      image,
      updatedAt: new Date(),
    },
  });

  return newCook;
};

export const updateCoook = async (id: string, body: any) => {
  if (!id) {
    throw new Error("Please provide cook Id!");
  }

  const { name, email, rate, cuisine, description, image } = body;

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
  const cooks = await client.cook.findMany();
  return cooks;
};

export const getCookById = async (id: string) => {
  if (!id) {
    throw new Error("Please provide a valid cook ID!");
  }

  const cook = await client.cook.findUnique({
    where: { id },
  });

  if (!cook) {
    throw new Error("Cook not found!");
  }

  return cook;
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
