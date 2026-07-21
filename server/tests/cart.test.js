import request from "supertest";
import app from "../server.js";
import prisma from "../utils/prismaClient.js";

jest.mock("../utils/prismaClient.js", () => ({
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    upsert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../utils/logger.js", () => jest.fn().mockResolvedValue(true));

describe("Cart Endpoints (/cart)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /cart", () => {
    it("should return 401 if x-user-id header is missing", async () => {
      const res = await request(app).get("/cart");
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/User identity required/i);
    });

    it("should return cart data for a valid user", async () => {
      const mockCart = { id: 1, userId: 10, items: [] };
      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const res = await request(app).get("/cart").set("x-user-id", "10");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockCart);
    });
  });

  describe("POST /cart", () => {
    it("should add an item to the cart", async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 10 });
      prisma.cartItem.upsert.mockResolvedValue({
        cartId: 1,
        productId: 5,
        quantity: 1,
      });

      const res = await request(app)
        .post("/cart")
        .set("x-user-id", "10")
        .send({ productId: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item added to cart");
    });
  });

  describe("PUT /cart", () => {
    it("should update item quantity", async () => {
      prisma.cartItem.update.mockResolvedValue({
        cartId: 1,
        productId: 5,
        quantity: 3,
      });

      const res = await request(app)
        .put("/cart")
        .set("x-user-id", "10")
        .send({ cartId: 1, productId: 5, quantity: 3 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Quantity updated");
    });
  });

  describe("DELETE /cart", () => {
    it("should remove item from cart", async () => {
      prisma.cartItem.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/cart")
        .set("x-user-id", "10")
        .send({ cartId: 1, productId: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item removed from cart");
    });
  });
});
