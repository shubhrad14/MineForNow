const Item = require("../models/Item");

// ========================================================
// GET ALL AVAILABLE ITEMS (BROWSE PAGE)
// Only displays items listed by users that are AVAILABLE
// ========================================================
const getAvailableItems = async (req, res) => {
  try {
    const { search, category, location, minPrice, maxPrice, occasion } = req.query;

    // Base query: ONLY show available items
    const query = {
      isAvailable: true,
      availabilityStatus: "Available",
      quantity: { $gt: 0 },
    };

    // Optional Search filter
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
      ];
    }

    // Category filter
    if (category && category.trim() !== "") {
      query.category = category.trim();
    }

    // Location filter
    if (location && location.trim() !== "") {
      query.location = new RegExp(location.trim(), "i");
    }

    // Occasion filter
    if (occasion && occasion.trim() !== "") {
      query.occasions = { $in: [occasion.trim()] };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const items = await Item.find(query)
      .populate("owner", "name email phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Error fetching available items:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching available items.",
      error: error.message,
    });
  }
};

// ========================================================
// GET SINGLE ITEM DETAILS
// ========================================================
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "name email phone profileImage isVerified"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching item details:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching item details.",
      error: error.message,
    });
  }
};

// ========================================================
// GET SIMILAR ITEMS
// e.g., viewing a "Sony Camera" shows other cameras & Sony gear
// ONLY returns items that are AVAILABLE and listed by users
// ========================================================
const getSimilarItems = async (req, res) => {
  try {
    const currentItem = await Item.findById(req.params.id);

    if (!currentItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    // Extract key search terms from the current item's name
    // (e.g. "Sony A7 Camera" -> ["sony", "a7", "camera"])
    const words = currentItem.name
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter((w) => w.length > 2);

    // Build similar match criteria
    const similarityConditions = [];

    // 1. Same brand (if provided)
    if (currentItem.brand) {
      similarityConditions.push({
        brand: new RegExp(`^${currentItem.brand}$`, "i"),
      });
    }

    // 2. Matching key words in the title (e.g., "Camera", "Lens")
    words.forEach((word) => {
      similarityConditions.push({
        name: new RegExp(word, "i"),
      });
    });

    // 3. Same category fallback
    similarityConditions.push({
      category: currentItem.category,
    });

    // Find similar items excluding the current one, and ONLY available
    const similarItems = await Item.find({
      _id: { $ne: currentItem._id },
      isAvailable: true,
      availabilityStatus: "Available",
      $or: similarityConditions,
    })
      .populate("owner", "name profileImage")
      .limit(6);

    return res.status(200).json({
      success: true,
      count: similarItems.length,
      similarItems,
    });
  } catch (error) {
    console.error("Error fetching similar items:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching similar items.",
      error: error.message,
    });
  }
};

// ========================================================
// CREATE / LIST A NEW ITEM (OWNER ACTION)
// ========================================================
const createItem = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      location,
      price,
      period,
      securityDeposit,
      quantity,
      image,
      images,
      description,
      requiresApproval,
      occasions,
      tags,
    } = req.body;

    if (!name || !category || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category, location, and price are required.",
      });
    }

    const newItem = await Item.create({
      name: name.trim(),
      category: category.trim(),
      brand: brand ? brand.trim() : "",
      location: location.trim(),
      price: Number(price),
      period: period || "/ day",
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      quantity: quantity ? Number(quantity) : 1,
      image: image || "",
      images: images || [],
      description: description ? description.trim() : "",
      requiresApproval: Boolean(requiresApproval),
      occasions: occasions || [],
      tags: tags || [],
      isAvailable: true,
      availabilityStatus: "Available",
      owner: req.user._id, // linked to logged-in user
    });

    return res.status(201).json({
      success: true,
      message: "Rental item listed successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("Error creating item:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error creating rental item.",
      error: error.message,
    });
  }
};

// ========================================================
// ADD / SUBMIT A REVIEW FOR AN ITEM
// POST /api/items/:id/reviews
// ========================================================
const addItemReview = async (req, res) => {
  try {
    const { rating, comment, userId, userName } = req.body;
    const itemId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating (1 to 5) and comment are required.",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    // New review object
    const newReview = {
      user: userId || req.user?._id,
      userName: userName || req.user?.name || "Verified Renter",
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    // Add review to item
    item.reviews.push(newReview);
    item.reviewCount = item.reviews.length;

    // Recalculate average rating
    const totalScore = item.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    item.rating = Number((totalScore / item.reviews.length).toFixed(1));

    await item.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully!",
      rating: item.rating,
      reviewCount: item.reviewCount,
      reviews: item.reviews,
    });
  } catch (error) {
    console.error("Add Review Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error submitting review." });
  }
};


// ========================================================
// UPDATE ITEM AVAILABILITY (WHEN ORDER IS CONFIRMED)
// PATCH /api/items/:id/availability
// ========================================================
const updateItemAvailability = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const { isAvailable, availabilityStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(200).json({ success: true, message: "Non-mongo id acknowledged." });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }

    if (typeof isAvailable !== "undefined") item.isAvailable = Boolean(isAvailable);
    if (availabilityStatus) item.availabilityStatus = availabilityStatus;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item availability updated successfully.",
      item,
    });
  } catch (error) {
    console.error("Update availability error:", error.message);
    return res.status(500).json({ success: false, message: "Server error updating availability." });
  }
};

module.exports = {
  updateItemAvailability,
  getAvailableItems,
  getItemById,
  getSimilarItems,
  createItem,
  addItemReview,
};
