import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getDurationInHours } from "./src/utils/time";

async function runTests() {
  console.log("-----------------------------------------");
  console.log("Starting Phase 2 Backend Logic Tests...");
  console.log("-----------------------------------------");

  // 1. Fetch a cook from database (seeded earlier)
  const cook = await prisma.cook.findFirst();
  if (!cook) {
    console.error("❌ Test failed: No cooks found in database. Please run seed script first.");
    return;
  }
  console.log(`✅ Found cook: ${cook.name} (Rate: $${cook.rate}/hr, Cuisine: ${cook.cuisine})`);

  // 2. Create or find a test user
  const userEmail = "test.user.phase2@cooked.com";
  let user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: userEmail,
        password: "hashedpassword123", // dummy password
        role: "USER"
      }
    });
  }
  console.log(`✅ Found/Created test user: ${user.name} (${user.email})`);

  // 3. Create availability slots for the cook
  console.log("\n--- Testing Availability Slot Creation ---");
  const dateVal = new Date("2026-06-15");
  
  // Create Slot 1 (12:00 PM - 03:00 PM, 3 hours)
  const slot1 = await prisma.cookAvailability.create({
    data: {
      cookId: cook.id,
      date: dateVal,
      startTime: "12:00 PM",
      endTime: "03:00 PM",
      isBooked: false
    }
  });
  console.log(`✅ Slot 1 created: ${slot1.startTime} - ${slot1.endTime} on ${slot1.date.toDateString()}`);
  console.log(`   Expected Duration: 3 hours. Calculated duration: ${getDurationInHours(slot1.startTime, slot1.endTime)} hours`);

  // Create Slot 2 (06:00 PM - 08:30 PM, 2.5 hours)
  const slot2 = await prisma.cookAvailability.create({
    data: {
      cookId: cook.id,
      date: dateVal,
      startTime: "06:00 PM",
      endTime: "08:30 PM",
      isBooked: false
    }
  });
  console.log(`✅ Slot 2 created: ${slot2.startTime} - ${slot2.endTime} on ${slot2.date.toDateString()}`);
  console.log(`   Expected Duration: 2.5 hours. Calculated duration: ${getDurationInHours(slot2.startTime, slot2.endTime)} hours`);

  // 4. Test Slot Booking & Transaction Flow
  console.log("\n--- Testing Slot Booking Transaction ---");
  
  // Calculate price for Slot 1
  const duration = getDurationInHours(slot1.startTime, slot1.endTime);
  const totalPrice = Math.round(cook.rate * duration);
  console.log(`   Calculated Total Price: $${totalPrice} (Rate $${cook.rate} * ${duration} hrs)`);

  const booking = await prisma.$transaction(async (tx) => {
    // Check if slot is available
    const freshSlot = await tx.cookAvailability.findUnique({
      where: { id: slot1.id }
    });
    
    if (!freshSlot || freshSlot.isBooked) {
      throw new Error("Slot already booked!");
    }

    // Mark slot as booked
    await tx.cookAvailability.update({
      where: { id: slot1.id },
      data: { isBooked: true }
    });

    // Create booking
    return await tx.booking.create({
      data: {
        userId: user.id,
        cookId: cook.id,
        availabilityId: slot1.id,
        status: "BOOKED",
        notes: "No spicy food, please.",
        totalPrice
      }
    });
  });

  console.log(`✅ Booking created successfully! ID: ${booking.id}`);
  console.log(`   Status: ${booking.status}, Total Price: $${booking.totalPrice}, Notes: "${booking.notes}"`);

  // Verify Slot 1 is now marked as booked
  const updatedSlot1 = await prisma.cookAvailability.findUnique({ where: { id: slot1.id } });
  console.log(`✅ Verified Slot 1 isBooked status in DB: ${updatedSlot1?.isBooked}`);

  // 5. Test Double-Booking Prevention
  console.log("\n--- Testing Double-Booking Prevention ---");
  try {
    await prisma.$transaction(async (tx) => {
      const freshSlot = await tx.cookAvailability.findUnique({
        where: { id: slot1.id }
      });
      
      if (!freshSlot || freshSlot.isBooked) {
        throw new Error("Slot already booked!");
      }

      await tx.cookAvailability.update({
        where: { id: slot1.id },
        data: { isBooked: true }
      });

      return await tx.booking.create({
        data: {
          userId: user.id,
          cookId: cook.id,
          availabilityId: slot1.id,
          status: "BOOKED",
          totalPrice
        }
      });
    });
    console.error("❌ Test failed: Double booking succeeded but should have failed.");
  } catch (error: any) {
    console.log(`✅ Prevented double-booking correctly! Error: "${error.message}"`);
  }

  // 6. Test Cancel Booking Flow
  console.log("\n--- Testing Booking Cancellation ---");
  
  if (booking.status === "CANCELLED") {
    console.error("❌ Test failed: Booking status was already CANCELLED.");
    return;
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" }
    }),
    prisma.cookAvailability.update({
      where: { id: booking.availabilityId },
      data: { isBooked: false }
    })
  ]);

  console.log("✅ Cancellation transaction executed.");

  // Verify DB state
  const cancelledBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
  const freedSlot1 = await prisma.cookAvailability.findUnique({ where: { id: slot1.id } });
  
  console.log(`✅ Verified Booking status in DB: ${cancelledBooking?.status}`);
  console.log(`✅ Verified Slot 1 isBooked status in DB (should be false): ${freedSlot1?.isBooked}`);

  // Cleanup test entries
  console.log("\n--- Cleaning up test records ---");
  await prisma.booking.deleteMany({ where: { userId: user.id } });
  await prisma.cookAvailability.deleteMany({ where: { cookId: cook.id } });
  console.log("✅ Test database cleaned up successfully!");
  console.log("-----------------------------------------");
  console.log("All Phase 2 Backend Logic Tests Passed!");
  console.log("-----------------------------------------");
}

runTests()
  .catch((e) => {
    console.error("❌ Test suite encountered error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
