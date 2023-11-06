const express = require("express");
const router = express.Router();
const {
  createBankAccount,
  getAllBankAccounts,
  getBankAccontById,
  updateBankAccounts,
  deleteBankAccount,
  depositBalance,
  withdrawBalance,
} = require("../controllers/bank_account.controller");
const {
  CheckPostAccountReq,
  CheckDepositWithdraw,
} = require("../middleware/middleware");

router.post("/", CheckPostAccountReq, createBankAccount);
router.get("/", getAllBankAccounts);
router.get("/:accountsId", getBankAccontById);
router.put("/:accountsId", updateBankAccounts);
router.delete("/:accountsId", deleteBankAccount);
router.put("/deposit/:accountsId", CheckDepositWithdraw, depositBalance);
router.put("/withdraw/:accountsId", CheckDepositWithdraw, withdrawBalance);

module.exports = router;
