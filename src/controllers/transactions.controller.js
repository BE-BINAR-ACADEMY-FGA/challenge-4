const { PrismaClient } = require("@prisma/client");
const { templateResponse } = require("../helpers/template-response");
const prisma = new PrismaClient();

const transferMoney = async (req, res) => {
  const { source_account_id, destination_account_id, amount } = req.body;

  try {
    const sourceAccountId = Number(source_account_id);
    const destinationAccountId = Number(destination_account_id);
    const transferAmount = Number(amount);

    // Retrieve source and destination accounts from the database
    const sourceAccount = await prisma.bank_Account.findUnique({
      where: { id: sourceAccountId },
    });

    const destinationAccount = await prisma.bank_Account.findUnique({
      where: { id: destinationAccountId },
    });

    if (!sourceAccount || !destinationAccount) {
      // Handle cases where the source or destination account is not found
      let resp = templateResponse("error", "Account not found");
      return res.status(404).json(resp);
    }

    if (sourceAccount.balance < transferAmount) {
      // Handle insufficient balance in the source account
      let resp = templateResponse("error", "Insufficient balance");
      return res.status(400).json(resp);
    }

    // Update the balances for the source and destination accounts
    await prisma.bank_Account.update({
      where: { id: sourceAccountId },
      data: {
        balance: {
          decrement: transferAmount,
        },
      },
    });

    await prisma.bank_Account.update({
      where: { id: destinationAccountId },
      data: {
        balance: {
          increment: transferAmount,
        },
      },
    });

    // Create the transaction record
    const transaction = await prisma.transaction.create({
      data: {
        source_account_id: sourceAccountId,
        destination_account_id: destinationAccountId,
        amount: transferAmount,
      },
      select: {
        id: true,
        source_account_id: true,
        destination_account_id: true,
        amount: true,
      },
    });

    let resp = templateResponse(
      "success",
      "Transaction successfully",
      transaction
    );
    return res.status(201).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "Transaction failed", error.message);
    return res.status(400).json(resp);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        source_account_id: true,
        destination_account_id: true,
        amount: true,
      },
    });

    let resp = templateResponse(
      "success",
      "Transactions retrieved successfully",
      transactions
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse(
      "error",
      "Transactions retrieval failed",
      error
    );
    return res.status(400).json(resp);
  }
};

const getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(transactionId),
      },
      select: {
        id: true,
        amount: true,
        sourceAccount: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        destinationAccount: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    let resp = templateResponse(
      "success",
      "User retrieved successfully",
      transaction
    );
    return res.status(200).json(resp);
  } catch (error) {
    let resp = templateResponse("error", "internal server error", error);
    return res.status(500).json(resp);
  }
};

module.exports = {
  transferMoney,
  getAllTransactions,
  getTransactionById,
};
