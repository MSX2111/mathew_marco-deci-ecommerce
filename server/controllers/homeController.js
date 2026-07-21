import prisma from "../utils/prismClient.js";

async function getHomeData(req, res) {
  try {
    // 1. Fetch a maximum of 4 featured products for the main shelf layout
    const featuredProducts = await prisma.Products.findMany({
      take: 4,
      orderBy: { id: "desc" },
    });

    // 2. Define static promotional banners to avoid schema bloat
    const promotions = [
      {
        id: 1,
        title: "Flash Tech Sale",
        subtitle: "Up to 20% off all computers this week only",
        badge: "Limited Time",
        imageURL: "https://unsplash.com",
      },
      {
        id: 2,
        title: "Upgrade Your Mobile",
        subtitle: "Trade in your old device for the newest flagship models",
        badge: "Hot Deal",
        imageURL: "https://unsplash.com",
      },
    ];

    // 3. Define structured category anchors for landing grids
    const categories = [
      { id: "computers", name: "Computers", itemCount: "Browse Systems" },
      { id: "phones", name: "Phones", itemCount: "Explore Devices" },
      { id: "accessories", name: "Accessories", itemCount: "View Extras" },
    ];

    return res.status(200).json({
      promotions,
      categories,
      featuredProducts,
    });
  } catch (error) {
    console.error("Home Data Fetch Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { getHomeData };
