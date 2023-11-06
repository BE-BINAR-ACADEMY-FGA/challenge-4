const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const bankAccountRoute = require("./bankAccount.route");

router.use("/v1/users", userRoute);
router.use("/v1/accounts", bankAccountRoute);

module.exports = router;
