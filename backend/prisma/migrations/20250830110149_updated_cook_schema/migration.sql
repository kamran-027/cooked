/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Cook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Cook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cook" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cook_email_key" ON "public"."Cook"("email");
