import request from "supertest";
import app from "../server.js";

jest.mock("../utils/prismaClient.js", () => ({
  __esModule: true,
  default: {
    Products: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("../models/activityLog.js", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

import prisma from "../utils/prismaClient.js";
import ActivityLog from "../models/activityLog.js";

describe("Home & Admin Log Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /home", () => {
    it("should fetch homepage promotions, categories, and featured products", async () => {
      prisma.Products.findMany.mockResolvedValue([{ id: 1, name: "Laptop" }]);

      const res = await request(app).get("/home");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("promotions");
      expect(res.body).toHaveProperty("categories");
      expect(res.body).toHaveProperty("featuredProducts");
    });
  });

  describe("GET /admin/logs", () => {
    it("should fetch paginated activity logs", async () => {
      const mockLogs = [{ action: "USER_LOGIN", userId: 1 }];

      // Mock full chain: .sort().skip().limit()
      ActivityLog.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockLogs),
          }),
        }),
      });

      ActivityLog.countDocuments.mockResolvedValue(1);

      const res = await request(app).get("/admin/logs?page=1");

      expect(res.statusCode).toBe(200);
      expect(res.body.logs).toEqual(mockLogs);
      expect(res.body.totalCount).toBe(1);
    });
  });
});
