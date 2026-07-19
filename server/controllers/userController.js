import prisma from "../utils/prismaClient.js";

async function createUser(req, res) {
  console.log(req.body);
  try {
    const user = await prisma.User.create({ data: req.body });
    if (user) {
      delete user.password;
    }
    return res.status(201).json(user);
    console.log("User created");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to create user" });
  }
}

async function loginUser(req, res) {
  console.log(req.body.email);
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
    delete user.password;
    return res.status(200).json(user);
    console.log(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findUser(req, res) {
  try {
    const user = await prisma.User.findFirst({
      where: {
        id: Number(req.body.uid),
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    console.log(req.body);
    const user = await prisma.User.update({
      where: {
        id: Number(req.body.uid),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { createUser, loginUser, findUser, updateUser };
