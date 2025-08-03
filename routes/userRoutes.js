const express = require("express");
const router = express.Router();
const { 
  getAllUsers,
  getAgents,
  getCustomers,
  createAgent,
  updateUser,
  deleteUser,
  getUserById
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// All routes require admin privileges
router.use(authMiddleware, adminOnly);

router.get("/all", getAllUsers);
router.get("/agents", getAgents);
router.get("/customers", getCustomers);
router.post("/create-agent", createAgent);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUserById);

module.exports = router; 