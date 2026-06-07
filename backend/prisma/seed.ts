import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const cooks = [
  {
    name: "Aria Bennett",
    email: "aria.bennett@cooked.com",
    cuisine: "Mediterranean",
    description: "Specializes in fresh Mediterranean meal-prep menus with balanced flavors.",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    rate: 150,
  },
  {
    name: "Noah Patel",
    email: "noah.patel@cooked.com",
    cuisine: "Indian",
    description: "Home-style North Indian and Indo-fusion dishes with custom spice levels.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    rate: 100,
  },
  {
    name: "Sofia Martinez",
    email: "sofia.martinez@cooked.com",
    cuisine: "Mexican",
    description: "Known for flavorful tacos, enchiladas, and modern Mexican comfort food.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    rate: 200,
  },
  {
    name: "Ethan Cole",
    email: "ethan.cole@cooked.com",
    cuisine: "American",
    description: "Focuses on elevated American classics and high-protein family meals.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    rate: 250,
  },
  {
    name: "Maya Kim",
    email: "maya.kim@cooked.com",
    cuisine: "Korean",
    description: "Korean home cooking expert, from bibimbap to slow-cooked stews.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80",
    rate: 150,
  },
  {
    name: "Leo Fischer",
    email: "leo.fischer@cooked.com",
    cuisine: "German",
    description: "Traditional German comfort dishes with a modern plating approach.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    rate: 100,
  },
  {
    name: "Zara Ahmed",
    email: "zara.ahmed@cooked.com",
    cuisine: "Middle Eastern",
    description: "Specializes in mezze spreads, grilled mains, and family-style feasts.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
    rate: 200,
  },
  {
    name: "Oliver Grant",
    email: "oliver.grant@cooked.com",
    cuisine: "Italian",
    description: "Fresh pasta, rustic sauces, and Italian dinner experiences at home.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80",
    rate: 300,
  },
  {
    name: "Ava Johnson",
    email: "ava.johnson@cooked.com",
    cuisine: "Vegan",
    description: "Plant-forward chef creating nutrient-dense and flavor-packed menus.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    rate: 150,
  },
  {
    name: "Rafael Silva",
    email: "rafael.silva@cooked.com",
    cuisine: "Brazilian",
    description: "Brazilian staples and grilled specialties with bold, bright profiles.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    rate: 200,
  },
  {
    name: "Hana Suzuki",
    email: "hana.suzuki@cooked.com",
    cuisine: "Japanese",
    description: "Balanced Japanese meals with precision prep and seasonal ingredients.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    rate: 250,
  },
  {
    name: "Daniel Moore",
    email: "daniel.moore@cooked.com",
    cuisine: "BBQ",
    description: "Low-and-slow barbecue specialist with house-made sauces and rubs.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    rate: 150,
  },
  {
    name: "Priya Nair",
    email: "priya.nair@cooked.com",
    cuisine: "South Indian",
    description: "Authentic South Indian menus including dosas, curries, and rice bowls.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    rate: 100,
  },
  {
    name: "Lucas Dubois",
    email: "lucas.dubois@cooked.com",
    cuisine: "French",
    description: "Classical French techniques adapted for cozy in-home dining.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    rate: 300,
  },
  {
    name: "Nina Petrova",
    email: "nina.petrova@cooked.com",
    cuisine: "Eastern European",
    description: "Hearty Eastern European soups, dumplings, and baked specialties.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1598103442097-8b743e4b3a7a?auto=format&fit=crop&w=800&q=80",
    rate: 100,
  },
];

const mockReviewers = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Sarah Connor", email: "sarah@example.com" },
  { name: "Emily Watson", email: "emily@example.com" },
  { name: "Michael Brown", email: "michael@example.com" },
  { name: "David Lee", email: "david@example.com" },
];

const reviewTemplates = [
  [
    { rating: 5, comment: "Absolutely incredible experience! The food was delicious and the kitchen was left spotless." },
    { rating: 4, comment: "Great chef with excellent culinary skills. The meal-prep was well-organized." },
    { rating: 5, comment: "Felt like eating at a 5-star restaurant right in our own home! Highly recommended." }
  ],
  [
    { rating: 5, comment: "Phenomenal flavors and presentation. Exceeded all our expectations." },
    { rating: 5, comment: "Very polite, professional, and cooked exactly to our custom preferences." },
    { rating: 4, comment: "A wonderful meal. We had a great time and will definitely book again." }
  ],
  [
    { rating: 5, comment: "The best dining service I've ever booked! Everything was seasoned perfectly." },
    { rating: 4, comment: "Very tasty dishes, clean prep. Kids loved the main course." },
    { rating: 5, comment: "Excellent service, friendly attitude, and amazing flavors!" }
  ]
];

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Seed Reviewers (Users)
  console.log("Seeding reviewers...");
  const dbUsers = [];
  for (const reviewer of mockReviewers) {
    const dbUser = await prisma.user.upsert({
      where: { email: reviewer.email },
      update: {
        name: reviewer.name,
      },
      create: {
        name: reviewer.name,
        email: reviewer.email,
        password: hashedPassword,
        role: "USER",
      }
    });
    dbUsers.push(dbUser);
  }

  // 1. Seed Cooks
  console.log("Seeding cooks...");
  const dbCooks = [];
  for (const cook of cooks) {
    const dbCook = await prisma.cook.upsert({
      where: { email: cook.email },
      update: {
        name: cook.name,
        cuisine: cook.cuisine,
        description: cook.description,
        image: cook.image,
        coverImage: cook.coverImage,
        rate: cook.rate,
        updatedAt: new Date(),
      },
      create: {
        ...cook,
        updatedAt: new Date(),
      },
    });
    dbCooks.push(dbCook);
  }
  console.log(`Seed complete: upserted ${dbCooks.length} cooks.`);

  // Seed Reviews
  console.log("Cleaning old reviews...");
  await prisma.review.deleteMany({});

  console.log("Seeding chef reviews...");
  let reviewCount = 0;
  for (let i = 0; i < dbCooks.length; i++) {
    const cook = dbCooks[i];
    // Assign one of the review templates based on index
    const reviewsToSeed = reviewTemplates[i % reviewTemplates.length];

    for (let j = 0; j < reviewsToSeed.length; j++) {
      const template = reviewsToSeed[j];
      const reviewer = dbUsers[j % dbUsers.length];

      await prisma.review.create({
        data: {
          userId: reviewer.id,
          cookId: cook.id,
          rating: template.rating,
          comment: template.comment
        }
      });
      reviewCount++;
    }
  }
  console.log(`Seed complete: created ${reviewCount} chef reviews.`);

  // 2. Clean existing slots first to avoid duplicate seeds
  console.log("Cleaning old availability slots...");
  await prisma.cookAvailability.deleteMany({});

  // 3. Generate slots for each cook: June 8, 2026 to June 15, 2026 (inclusive)
  console.log("Generating timeslots for the week of June 8 - June 15, 2026...");
  const timeSlots = [
    { startTime: "09:00 AM", endTime: "12:00 PM" },
    { startTime: "01:00 PM", endTime: "04:00 PM" },
    { startTime: "06:00 PM", endTime: "09:00 PM" },
  ];

  let slotsCreatedCount = 0;
  for (const cook of dbCooks) {
    for (let day = 8; day <= 15; day++) {
      const dateVal = new Date(`2026-06-${day.toString().padStart(2, "0")}T00:00:00Z`);

      for (const slot of timeSlots) {
        await prisma.cookAvailability.create({
          data: {
            cookId: cook.id,
            date: dateVal,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          },
        });
        slotsCreatedCount++;
      }
    }
  }

  console.log(`Success: Generated ${slotsCreatedCount} availability slots across all cooks.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
