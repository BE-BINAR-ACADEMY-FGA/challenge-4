const express = require("express");
const router = express.Router();
const {
  transferMoney,
  getAllTransactions,
  getTransactionById,
} = require("../controllers/transactions.controller");
// const { CheckPostReq } = require("../middleware/middleware");

router.post("/", transferMoney);
router.get("/", getAllTransactions);
router.get("/:transactionId", getTransactionById);

module.exports = router;
