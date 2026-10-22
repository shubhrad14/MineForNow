const express = require("express");
const router = express.Router();
const {
  getAvailableItems,
  getItemById,
  createItem,
  addItemReview,
  updateItemAvailability,
} = require("../controllers/itemController");

router.get("/", getAvailableItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.post("/:id/reviews", addItemReview); // <--- Review Route

router.patch("/:id/availability", updateItemAvailability);

module.exports = router;