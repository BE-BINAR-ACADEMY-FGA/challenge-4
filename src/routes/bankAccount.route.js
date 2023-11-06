const express = require("express");
const router = express.Router();
const {
  createBankAccount,
  getAllBankAccounts,
  getBankAccontById,
  updateBankAccounts,
  deleteBankAccount,
} = require("../controllers/bank_account.controller");
const { CheckPostAccountReq } = require("../middleware/middleware");

router.post("/", CheckPostAccountReq, createBankAccount);
router.get("/", getAllBankAccounts);
router.get("/:accountsId", getBankAccontById);
router.put("/:accountsId", updateBankAccounts);
router.delete("/:accountsId", deleteBankAccount);

module.exports = router;
