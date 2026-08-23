import { MongoClient } from "mongodb";

let clientPromise;

async function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGO_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export default async function handler(req, res) {
  try {
    const client = await getClient();
    const db = client.db();
    const reviews = db.collection("reviews");

    const result = await reviews
      .aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ])
      .toArray();

    const stats = result[0] ?? {
      totalReviews: 0,
      averageRating: 0,
    };

    res.status(200).json({
      success: true,
      totalReviews: stats.totalReviews,
      averageRating: Number(stats.averageRating.toFixed(2)),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Review stats failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate review statistics",
    });
  }
}
