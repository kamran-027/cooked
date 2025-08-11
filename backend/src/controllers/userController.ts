import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();

export const addUser = async (
  name: string,
  email: string,
  password: string
) => {
  const emailExists = await client.user.findUnique({
    where: { email },
  });

  if (emailExists) {
    throw new Error("Email already exists!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};
