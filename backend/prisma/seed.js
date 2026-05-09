import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const cooks = [
    {
        name: "Aria Bennett",
        email: "aria.bennett@cooked.com",
        cuisine: "Mediterranean",
        description: "Specializes in fresh Mediterranean meal-prep menus with balanced flavors.",
        image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=1200&q=80",
        rate: 42,
    },
    {
        name: "Noah Patel",
        email: "noah.patel@cooked.com",
        cuisine: "Indian",
        description: "Home-style North Indian and Indo-fusion dishes with custom spice levels.",
        image: "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=1200&q=80",
        rate: 38,
    },
    {
        name: "Sofia Martinez",
        email: "sofia.martinez@cooked.com",
        cuisine: "Mexican",
        description: "Known for flavorful tacos, enchiladas, and modern Mexican comfort food.",
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
        rate: 40,
    },
    {
        name: "Ethan Cole",
        email: "ethan.cole@cooked.com",
        cuisine: "American",
        description: "Focuses on elevated American classics and high-protein family meals.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        rate: 45,
    },
    {
        name: "Maya Kim",
        email: "maya.kim@cooked.com",
        cuisine: "Korean",
        description: "Korean home cooking expert, from bibimbap to slow-cooked stews.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
        rate: 44,
    },
    {
        name: "Leo Fischer",
        email: "leo.fischer@cooked.com",
        cuisine: "German",
        description: "Traditional German comfort dishes with a modern plating approach.",
        image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=1200&q=80",
        rate: 37,
    },
    {
        name: "Zara Ahmed",
        email: "zara.ahmed@cooked.com",
        cuisine: "Middle Eastern",
        description: "Specializes in mezze spreads, grilled mains, and family-style feasts.",
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80",
        rate: 43,
    },
    {
        name: "Oliver Grant",
        email: "oliver.grant@cooked.com",
        cuisine: "Italian",
        description: "Fresh pasta, rustic sauces, and Italian dinner experiences at home.",
        image: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8f70?auto=format&fit=crop&w=1200&q=80",
        rate: 46,
    },
    {
        name: "Ava Johnson",
        email: "ava.johnson@cooked.com",
        cuisine: "Vegan",
        description: "Plant-forward chef creating nutrient-dense and flavor-packed menus.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
        rate: 39,
    },
    {
        name: "Rafael Silva",
        email: "rafael.silva@cooked.com",
        cuisine: "Brazilian",
        description: "Brazilian staples and grilled specialties with bold, bright profiles.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        rate: 41,
    },
    {
        name: "Hana Suzuki",
        email: "hana.suzuki@cooked.com",
        cuisine: "Japanese",
        description: "Balanced Japanese meals with precision prep and seasonal ingredients.",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1200&q=80",
        rate: 48,
    },
    {
        name: "Daniel Moore",
        email: "daniel.moore@cooked.com",
        cuisine: "BBQ",
        description: "Low-and-slow barbecue specialist with house-made sauces and rubs.",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
        rate: 47,
    },
    {
        name: "Priya Nair",
        email: "priya.nair@cooked.com",
        cuisine: "South Indian",
        description: "Authentic South Indian menus including dosas, curries, and rice bowls.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
        rate: 36,
    },
    {
        name: "Lucas Dubois",
        email: "lucas.dubois@cooked.com",
        cuisine: "French",
        description: "Classical French techniques adapted for cozy in-home dining.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
        rate: 50,
    },
    {
        name: "Nina Petrova",
        email: "nina.petrova@cooked.com",
        cuisine: "Eastern European",
        description: "Hearty Eastern European soups, dumplings, and baked specialties.",
        image: "https://images.unsplash.com/photo-1603079847843-75f4f98f5eb1?auto=format&fit=crop&w=1200&q=80",
        rate: 35,
    },
];
async function main() {
    for (const cook of cooks) {
        await prisma.cook.upsert({
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
    }
    console.log(`Seed complete: upserted ${cooks.length} cooks.`);
}
main()
    .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
