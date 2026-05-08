-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_cookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropIndex
DROP INDEX "public"."Booking_cookId_key";

-- DropIndex
DROP INDEX "public"."Booking_userId_key";

-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "public"."Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_cookId_idx" ON "public"."Booking"("cookId");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_cookId_fkey" FOREIGN KEY ("cookId") REFERENCES "public"."Cook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
