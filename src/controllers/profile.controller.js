const { PrismaClient } = require("@prisma/client");
const { templateResponse } = require("../helpers/template-response");
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    });

    let resp = templateResponse("success", "User created successfully", user);
    return res.status(201).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "User creation failed", error);
    return res.status(400).json(resp);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    let resp = templateResponse(
      "success",
      "Users retrieved successfully",
      users
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Users retrieval failed", error);
    return res.status(400).json(resp);
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      let resp = templateResponse("error", "User not found", null);
      return res.status(404).json(resp);
    }
    let resp = templateResponse("success", "User retrieved successfully", user);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "internal server error", error);
    return res.status(500).json(resp);
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const payload = {};

  if (!name && !email) {
    let resp = templateResponse(
      "error",
      "Please provide at least one parameter to update",
      null
    );
    return res.json(resp);
  }

  if (name) {
    payload.name = name;
  }

  if (email) {
    payload.email = email;
  }

  try {
    const user = await prisma.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    let resp = templateResponse("success", "User updated successfully", user);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.users.delete({
      where: {
        id: Number(userId),
      },
    });

    let resp = templateResponse("success", "User deleted successfully", null);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};
module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
