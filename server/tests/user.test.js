import request from "supertest";
import app from "../server.js";

jest.mock("../utils/prismaClient.js", () => ({
  __esModule: true,
  default: {
    User: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../utils/logger.js", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

jest.mock("../utils/mailer.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import prisma from "../utils/prismaClient.js";

describe("User Endpoints (/users)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/signup", () => {
    it("should register a user and exclude password from response", async () => {
      const userData = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "securepassword",
      };

      prisma.User.create.mockResolvedValue({ ...userData });

      const res = await request(app).post("/users/signup").send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.password).toBeUndefined();
      expect(res.body.email).toBe("test@example.com");
    });
  });

  describe("POST /users/login", () => {
    it("should return 401 for invalid credentials", async () => {
      prisma.User.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .post("/users/login")
        .send({ email: "wrong@example.com", password: "bad" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid email or password");
    });
  });
});
