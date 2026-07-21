import prisma from "../utils/prismaClient.js";
import logActivity from "../utils/logger.js";
import sendWelcomeEmail from "../utils/mailer.js";
import {
  parseUserId,
  jsonError,
  buildUpdatePayload,
  toNumber,
} from "../utils/http.js";

async function createUser(req, res) {
  const user = await prisma.User.create({ data: req.body });
  if (user) delete user.password;

  await logActivity({
    userId: user.id,
    action: "USER_REGISTER",
    entityId: user.id,
    details: { email: req.body.email, name: req.body.name },
  });

  sendWelcomeEmail(req.body.email, req.body.name);
  return res.status(201).json(user);
}

async function loginUser(req, res) {
  const user = await prisma.User.findFirst({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  });

  if (!user) {
    return jsonError(res, "Invalid email or password", 401);
  }

  await logActivity({
    userId: user.id,
    action: "USER_LOGIN",
    entityId: user.id,
    details: { email: user.email },
  });

  return res.status(200).json(user);
}

async function findUser(req, res) {
  const user = await prisma.User.findFirst({
    where: { id: toNumber(req.body.uid) },
  });

  return res.status(200).json(user);
}

async function updateUser(req, res) {
  const payload = buildUpdatePayload(req.body, ["name", "email", "password"]);
  const user = await prisma.User.update({
    where: { id: toNumber(req.body.uid) },
    data: payload,
  });

  await logActivity({
    userId: user.id,
    action: "USER_UPDATE",
    entityId: user.id,
    details: { updatedFields: Object.keys(payload) },
  });

  return res.status(200).json(user);
}

export default { createUser, loginUser, findUser, updateUser };
