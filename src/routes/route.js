const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");

router.use("/v1/users", userRoute);

module.exports = router;
