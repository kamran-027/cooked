-- CreateTable
CREATE TABLE "public"."Cook" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "cookId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_key" ON "public"."Booking"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_cookId_key" ON "public"."Booking"("cookId");

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_cookId_fkey" FOREIGN KEY ("cookId") REFERENCES "public"."Cook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
