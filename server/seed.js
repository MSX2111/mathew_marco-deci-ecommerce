import prisma from "./utils/prismaClient.js";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password1",
    isAdmin: false,
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password2",
    isAdmin: false,
  },
];
const testProducts = [
  {
    name: "QuantumPro MacBook 16",
    description:
      "Supercharged M3 laptop with 32GB unified memory and 1TB SSD. Perfect for heavy compilation tasks and design workloads.",
    price: 2499,
    imageURL: "https://unsplash.com",
    category: "computers",
  },
  {
    name: "Apex Gaming Desktop Station",
    description:
      "Liquid-cooled workstation packing an RTX 4080 GPU, 64GB DDR5 RAM, and a ultra-fast 2TB NVMe solid state drive system.",
    price: 1899,
    imageURL: "https://unsplash.com",
    category: "computers",
  },
  {
    name: "UltraThin Chromebook 14",
    description:
      "Lightweight, cloud-first productivity machine built for all-day education tasks with extended 14-hour continuous battery life.",
    price: 349,
    imageURL: "https://unsplash.com",
    category: "computers",
  },

  {
    name: "Vortex Alpha Flagship Pro",
    description:
      "Next-gen smartphone featuring a 200MP cinema lens array, dynamic 120Hz titanium frame display, and satellite calling systems.",
    price: 1199,
    imageURL: "https://unsplash.com",
    category: "phones",
  },
  {
    name: "Nexus Horizon Flip Phone",
    description:
      "Foldable micro-OLED touchscreen device that transitions from a standard palm-sized mobile straight into an immersive tablet setup.",
    price: 1450,
    imageURL: "https://unsplash.com",
    category: "phones",
  },
  {
    name: "EcoLite Sustainable Mobile",
    description:
      "100% recycled structural chassis housing clean open-source architecture built for modular component user-repairs.",
    price: 499,
    imageURL: "https://unsplash.com",
    category: "phones",
  },

  {
    name: "AeroPulse ANC Wireless Headphones",
    description:
      "Hybrid adaptive noise-cancelling over-ear auditory phones delivering high-fidelity audio up to 40 hours per single full charge.",
    price: 299,
    imageURL: "https://unsplash.com",
    category: "accessories",
  },
  {
    name: "Matrix Ergonomic Mech Keyboard",
    description:
      "Hot-swappable linear mechanical switch board with wireless multi-device synchronization and ambient RGB custom profiling animations.",
    price: 125,
    imageURL: "https://unsplash.com",
    category: "accessories",
  },
  {
    name: "TitanStream Pro Hub Adapter",
    description:
      "6-in-1 multi-port docking connector supplying dual 4K HDMI pipelines, SD reader slots, and 100W power delivery speeds.",
    price: 79,
    imageURL: "https://unsplash.com",
    category: "accessories",
  },
];

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.User.deleteMany();
  await prisma.Products.deleteMany();

  const createdUsers = await prisma.User.createMany({
    data: users,
    skipDuplicates: true,
  });
  const createdProducts = await prisma.Products.createMany({
    data: testProducts,
    skipDuplicates: true,
  });

  const jane = await prisma.User.findUnique({
    where: { email: "jane@example.com" },
  });
  const mouse = await prisma.Products.findUnique({
    where: { name: "Wireless Mouse" },
  });
  const watch = await prisma.Products.findUnique({
    where: { name: "Smart Fitness Watch" },
  });

  if (jane && mouse && watch) {
    await prisma.Cart.create({
      data: {
        userId: jane.id,
        items: {
          create: [
            { productId: mouse.id, quantity: 2 },
            { productId: watch.id, quantity: 1 },
          ],
        },
      },
    });
  }

  console.log(
    `Seeded ${createdUsers.count} users and ${createdProducts.count} products.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
