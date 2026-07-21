import prisma from "../utils/prismClient.js";
import logActivity from "../utils/logger.js";
import sendWelcomeEmail from "../utils/mailer.js";

async function createUser(req, res) {
  try {
    const user = await prisma.User.create({ data: req.body });
    if (user) {
      delete user.password;
    }

    await logActivity({
      userId: user.id,
      action: "USER_REGISTER",
      entityId: user.id,
      details: { email: req.body.email, name: req.body.name },
    });

    sendWelcomeEmail(req.body.email, req.body.name);

    return res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to create user" });
  }
}

async function loginUser(req, res) {
  try {
    const user = await prisma.User.findFirst({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "No such user exists" });
    }

    await logActivity({
      userId: user.id,
      action: "USER_LOGIN",
      entityId: user.id,
      details: { email: user.email },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findUser(req, res) {
  try {
    const user = await prisma.User.findFirst({
      where: { id: Number(req.body.uid) },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const user = await prisma.User.update({
      where: { id: Number(req.body.uid) },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    });

    await logActivity({
      userId: user.id,
      action: "USER_UPDATE",
      entityId: user.id,
      details: { updatedFields: Object.keys(req.body) },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { createUser, loginUser, findUser, updateUser };
