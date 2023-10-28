const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { CheckPostReq } = require("../middleware/middleware");

router.post("/", CheckPostReq, createUser);
router.get("/", getAllUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
