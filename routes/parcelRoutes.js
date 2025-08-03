const express = require("express");
const router = express.Router();
const { 
  bookParcel, 
  getBookingHistory, 
  getAllParcels,
  getAssignedParcels,
  updateParcelStatus,
  assignAgentToParcel,
  getParcelById,
  getParcelByTrackingNumber,
  getDashboardStats
} = require("../controllers/parcelController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly, agentOnly } = require("../middleware/roleMiddleware");

// Customer routes
router.post("/book", authMiddleware, bookParcel);
router.get("/history", authMiddleware, getBookingHistory);
router.get("/track/:trackingNumber", getParcelByTrackingNumber);

// Agent routes
router.get("/assigned", authMiddleware, agentOnly, getAssignedParcels);
router.put("/:parcelId/status", authMiddleware, agentOnly, updateParcelStatus);

// Admin routes
router.get("/all", authMiddleware, adminOnly, getAllParcels);
router.put("/:parcelId/assign", authMiddleware, adminOnly, assignAgentToParcel);
router.get("/dashboard/stats", authMiddleware, adminOnly, getDashboardStats);

// General routes
router.get("/:parcelId", authMiddleware, getParcelById);

module.exports = router;