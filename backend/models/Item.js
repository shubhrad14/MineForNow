const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    period: {
      type: String,
      default: "/ day",
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Rented", "Maintenance"],
      default: "Available",
    },
    image: {
      type: String,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: "",
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    occasions: [
      {
        type: String,
      },
    ],
    // The user who listed this rental item
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        userName: String,
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for smart keyword and similarity search
itemSchema.index({ name: "text", category: "text", brand: "text", description: "text" });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
