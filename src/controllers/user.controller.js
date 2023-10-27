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
module.exports = {
  createUser,
  getAllUser,
};
