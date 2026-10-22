const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// =========================================
// API ROUTES
// =========================================
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// =========================================
// TEST ROUTE
// =========================================
app.get("/", (req, res) => {
  res.json({
    message: "MineForNow Backend API is running with Razorpay Gateway & Booking Engine",
  });
});

// =========================================
// SERVER START
// =========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
