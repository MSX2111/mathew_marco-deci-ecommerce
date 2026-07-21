import request from "supertest";
import app from "../server.js";
import prisma from "../utils/prismaClient.js";

jest.mock("../utils/prismaClient.js", () => ({
  Products: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
}));

jest.mock("../utils/logger.js", () => jest.fn().mockResolvedValue(true));

describe("Product Endpoints (/products)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /products", () => {
    it("should fetch paginated products via $transaction", async () => {
      const mockProducts = [{ id: 1, name: "Keyboard", price: 50 }];
      prisma.$transaction.mockResolvedValue([mockProducts, 1]);

      const res = await request(app).get("/products?page=1");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ products: mockProducts, totalCount: 1 });
    });
  });

  describe("GET /products/:id", () => {
    it("should return a single product if found", async () => {
      const mockProduct = { id: 1, name: "Mouse", price: 25 };
      prisma.Products.findUnique.mockResolvedValue(mockProduct);

      const res = await request(app).get("/products/1");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockProduct);
    });

    it("should return 404 if product is not found", async () => {
      prisma.Products.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/products/999");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Product record not found");
    });
  });

  describe("POST /products", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "Monitor",
        description: "4K Display",
        price: 300,
        imageURL: "http://example.com/img.jpg",
        category: "computers",
      };

      prisma.Products.create.mockResolvedValue({ id: 10, ...newProduct });

      const res = await request(app)
        .post("/products")
        .set("x-user-id", "1")
        .send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Monitor");
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product", async () => {
      prisma.Products.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/products/1")
        .set("x-user-id", "1");

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Product successfully deleted");
    });
  });
});
