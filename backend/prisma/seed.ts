import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cooks = [
  {
    name: "Aria Bennett",
    email: "aria.bennett@cooked.com",
    cuisine: "Mediterranean",
    description:
      "Specializes in fresh Mediterranean meal-prep menus with balanced flavors.",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 150,
  },
  {
    name: "Noah Patel",
    email: "noah.patel@cooked.com",
    cuisine: "Indian",
    description:
      "Home-style North Indian and Indo-fusion dishes with custom spice levels.",
    image:
      "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 100,
  },
  {
    name: "Sofia Martinez",
    email: "sofia.martinez@cooked.com",
    cuisine: "Mexican",
    description:
      "Known for flavorful tacos, enchiladas, and modern Mexican comfort food.",
    image:
      "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 200,
  },
  {
    name: "Ethan Cole",
    email: "ethan.cole@cooked.com",
    cuisine: "American",
    description:
      "Focuses on elevated American classics and high-protein family meals.",
    image:
      "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 250,
  },
  {
    name: "Maya Kim",
    email: "maya.kim@cooked.com",
    cuisine: "Korean",
    description:
      "Korean home cooking expert, from bibimbap to slow-cooked stews.",
    image:
      "https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 150,
  },
  {
    name: "Leo Fischer",
    email: "leo.fischer@cooked.com",
    cuisine: "German",
    description:
      "Traditional German comfort dishes with a modern plating approach.",
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 100,
  },
  {
    name: "Zara Ahmed",
    email: "zara.ahmed@cooked.com",
    cuisine: "Middle Eastern",
    description:
      "Specializes in mezze spreads, grilled mains, and family-style feasts.",
    image:
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 200,
  },
  {
    name: "Oliver Grant",
    email: "oliver.grant@cooked.com",
    cuisine: "Italian",
    description:
      "Fresh pasta, rustic sauces, and Italian dinner experiences at home.",
    image:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 300,
  },
  {
    name: "Ava Johnson",
    email: "ava.johnson@cooked.com",
    cuisine: "Vegan",
    description:
      "Plant-forward chef creating nutrient-dense and flavor-packed menus.",
    image:
      "https://images.pexels.com/photos/376533/pexels-photo-376533.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 150,
  },
  {
    name: "Rafael Silva",
    email: "rafael.silva@cooked.com",
    cuisine: "Brazilian",
    description:
      "Brazilian staples and grilled specialties with bold, bright profiles.",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 200,
  },
  {
    name: "Hana Suzuki",
    email: "hana.suzuki@cooked.com",
    cuisine: "Japanese",
    description:
      "Balanced Japanese meals with precision prep and seasonal ingredients.",
    image:
      "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 250,
  },
  {
    name: "Daniel Moore",
    email: "daniel.moore@cooked.com",
    cuisine: "BBQ",
    description:
      "Low-and-slow barbecue specialist with house-made sauces and rubs.",
    image:
      "https://images.pexels.com/photos/1234535/pexels-photo-1234535.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 150,
  },
  {
    name: "Priya Nair",
    email: "priya.nair@cooked.com",
    cuisine: "South Indian",
    description:
      "Authentic South Indian menus including dosas, curries, and rice bowls.",
    image:
      "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 100,
  },
  {
    name: "Lucas Dubois",
    email: "lucas.dubois@cooked.com",
    cuisine: "French",
    description: "Classical French techniques adapted for cozy in-home dining.",
    image:
      "https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 300,
  },
  {
    name: "Nina Petrova",
    email: "nina.petrova@cooked.com",
    cuisine: "Eastern European",
    description:
      "Hearty Eastern European soups, dumplings, and baked specialties.",
    image:
      "https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rate: 100,
  },
];

async function main() {
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
    // Generate dates: 2026-06-08 to 2026-06-15 (8 days)
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
