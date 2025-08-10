import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const addUser = async (
  name: string,
  email: string,
  password: string
) => {
  await client.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};
