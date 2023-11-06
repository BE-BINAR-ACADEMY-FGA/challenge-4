const { PrismaClient } = require("@prisma/client");
const { templateResponse } = require("../helpers/template-response");
const { string } = require("joi");
const prisma = new PrismaClient();

const createBankAccount = async (req, res) => {
  const { bank_name, bank_account_number, balance = 0, user_id } = req.body;
  try {
    const accounts = await prisma.bank_Account.create({
      data: {
        bank_name,
        bank_account_number,
        balance,
        user_id,
      },
    });
    let resp = templateResponse(
      "success",
      "Account created successfully",
      accounts
    );
    return res.status(201).json(resp);
  } catch (error) {
    let resp = templateResponse(
      "error",
      "Account creation failed",
      error.message
    );
    return res.status(400).json(resp);
  }
};

const getAllBankAccounts = async (req, res) => {
  try {
    const accounts = await prisma.bank_Account.findMany({
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        balance: true,
        user_id: true,
      },
    });
    let resp = templateResponse(
      "success",
      "Accounts retrieved successfully",
      accounts
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Accounts retrieval failed", error);
    return res.status(400).json(resp);
  }
};

const getBankAccontById = async (req, res) => {
  const { accountsId } = req.params;
  try {
    const accounts = await prisma.bank_Account.findUnique({
      where: {
        id: Number(accountsId),
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        balance: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                identity_type: true,
                identity_number: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!accounts) {
      let resp = templateResponse("error", "Account not found", null);
      return res.status(404).json(resp);
    }
    let resp = templateResponse(
      "success",
      "Account retrieved successfully",
      accounts
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "internal server error", error);
    return res.status(500).json(resp);
  }
};

const updateBankAccounts = async (req, res) => {
  const { accountsId } = req.params;
  const { bank_name, bank_account_number, balance = 0 } = req.body;
  const payload = {};

  if (bank_name) {
    payload.bank_name = bank_name;
  }

  if (bank_account_number) {
    payload.bank_account_number = bank_account_number;
  }

  if (balance) {
    payload.balance = balance;
  }

  try {
    const accounts = await prisma.bank_Account.update({
      where: {
        id: Number(accountsId),
      },
      data: {
        bank_name,
        bank_account_number,
        balance,
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        balance: true,
        user_id: true,
      },
    });

    let resp = templateResponse(
      "success",
      "Account updated successfully",
      accounts
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};

const deleteBankAccount = async (req, res) => {
  const { accountsId } = req.params;
  try {
    await prisma.bank_Account.delete({
      where: {
        id: Number(accountsId),
      },
    });

    let resp = templateResponse("success", "User deleted successfully", null);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};

const depositBalance = async (req, res) => {
  const { accountsId } = req.params;
  const { amount } = req.body;
  try {
    const accounts = await prisma.bank_Account.update({
      where: {
        id: Number(accountsId),
      },
      data: {
        balance: {
          increment: amount,
        },
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        balance: true,
        user_id: true,
      },
    });

    let resp = templateResponse("success", "Deposit successfully", accounts);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};

const withdrawBalance = async (req, res) => {
  const { accountsId } = req.params;
  const { amount } = req.body;

  try {
    const accounts = await prisma.bank_Account.update({
      where: {
        id: Number(accountsId),
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
      select: {
        id: true,
        bank_name: true,
        bank_account_number: true,
        balance: true,
        user_id: true,
      },
    });

    let resp = templateResponse("success", "Withdraw successfully", accounts);
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Not Found", error);
    return res.status(404).json(resp);
  }
};
module.exports = {
  createBankAccount,
  getAllBankAccounts,
  getBankAccontById,
  updateBankAccounts,
  deleteBankAccount,
  depositBalance,
  withdrawBalance,
};
