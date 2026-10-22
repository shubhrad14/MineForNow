import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  QrCode,
  Banknote,
  Gift,
  Percent,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state or fallback to cart from localStorage, or demo default
  const storedCart = JSON.parse(localStorage.getItem("mineForNowCart") || "[]");
  const currentUser = JSON.parse(localStorage.getItem("mineForNowUser") || "null");

  const paymentInfo = location.state || (
    storedCart.length > 0
      ? {
          mode: "checkout",
          cart: storedCart,
          dueToday: storedCart.reduce(
            (sum, item) => sum + Number(item.price || 0) * (item.rentalDays || 1),
            0
          ) || 351,
          totalDeposit: storedCart.reduce(
            (sum, item) => sum + Number(item.securityDeposit || 0),
            0
          ),
        }
      : {
          mode: "checkout",
          cart: [
            {
              id: 991,
              name: "Designer Wedding Lehenga",
              price: 300,
              rentalDays: 1,
              securityDeposit: 500,
              image: "",
            },
          ],
          dueToday: 351,
          totalDeposit: 500,
        }
  );

  const { mode = "checkout" } = paymentInfo;

  // Selected payment method tab: "upi" | "card" | "cod" | "gift" | "emi"
  const [selectedMethod, setSelectedMethod] = useState("upi");

  // Accordion toggles for price summary
  const [feesExpanded, setFeesExpanded] = useState(true);
  const [discountsExpanded, setDiscountsExpanded] = useState(true);

  // UPI State
  const [showQr, setShowQr] = useState(false);
  const [qrTimer, setQrTimer] = useState(300); // 5 minutes countdown

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(currentUser?.name || "");

  // Gift Card State
  const [giftCardNumber, setGiftCardNumber] = useState("");
  const [giftCardPin, setGiftCardPin] = useState("");
  const [giftApplied, setGiftApplied] = useState(false);

  // Processing indicator
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // QR countdown timer effect
  useEffect(() => {
    let timer;
    if (showQr && qrTimer > 0) {
      timer = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQr, qrTimer]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Base financial calculations matching Flipkart screenshot figures
  const rawTarget =
    mode === "checkout"
      ? Number(paymentInfo.dueToday || 351)
      : Number(paymentInfo.amount || 351);

  // Fees and Discounts
  const platformFee = 10;
  const handlingFee = 65;
  const mrpDiscount = 0;
  const couponDiscount = 24;
  const codHandlingFee = selectedMethod === "cod" ? 10 : 0;

  // Net non-item additions = 10 + 65 - 24 = 51
  const baseMrp = Math.max(rawTarget - 51, 100);

  // Calculated final total
  const totalAmount =
    baseMrp +
    platformFee +
    handlingFee +
    codHandlingFee -
    (mrpDiscount + couponDiscount) -
    (giftApplied ? 100 : 0);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM / YY)
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) {
      setCardExpiry(`${raw.slice(0, 2)} / ${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Format CVV (3 or 4 digits)
  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvv(raw);
  };

  // Card provider detection
  const getCardBrand = () => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(num)) return "MASTERCARD";
    if (/^6(011|5)/.test(num)) return "RUPAY";
    return "";
  };

  // Complete Booking in Storage and Navigate
  const completeOrder = (methodUsed = selectedMethod) => {
    setProcessing(true);

    setTimeout(() => {
      const existingRequests = JSON.parse(
        localStorage.getItem("mineForNowRentalRequests") || "[]"
      );
      const renterName = currentUser?.name || "You";

      const calculateDays = (item) => {
        if (!item.startDate || !item.endDate) return item.rentalDays || 1;
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24);
        return diff > 0 ? diff : 1;
      };

      if (mode === "checkout") {
        const cartItems = paymentInfo.cart || [];
        const newRequests = cartItems.map((item) => ({
          id: Date.now() + (item.id || Math.floor(Math.random() * 1000)),
          itemId: item.id,
          itemName: item.name,
          category: item.category || "General",
          image: item.image,
          renterId: currentUser?.id || "",
          renterName: renterName,
          location: item.location || "City",
          startDate: item.startDate || new Date().toISOString().split("T")[0],
          endDate: item.endDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
          dates: `${item.startDate || "Tomorrow"} – ${item.endDate || "Next Day"}`,
          rentalDays: calculateDays(item),
          pricePerDay: item.price,
          total: totalAmount,
          securityDeposit: Number(item.securityDeposit || paymentInfo.totalDeposit || 0),
          status: "Confirmed",
          paymentMethod: methodUsed.toUpperCase(),
          paymentStatus: methodUsed === "cod" ? "PendingOnDelivery" : "Paid",
          createdAt: new Date().toISOString(),
        }));

        localStorage.setItem(
          "mineForNowRentalRequests",
          JSON.stringify([...existingRequests, ...newRequests])
        );

        // ================================================================
        // AUTOMATIC AVAILABILITY UPDATE:
        // Mark all rented items as "unavailable" and assign them to renter.
        // They will be hidden from all other users in Browse!
        // ================================================================
        const rentedItemIds = cartItems.map((item) => String(item.id));
        const allListings = JSON.parse(
          localStorage.getItem("mineForNowListings") || "[]"
        );
        const updatedListings = allListings.map((listing) => {
          if (rentedItemIds.includes(String(listing.id))) {
            return {
              ...listing,
              availability: "unavailable",
              isAvailable: false,
              availabilityStatus: "Rented",
              rentedBy: currentUser?.id || currentUser?.email || "current_user",
              renterName: renterName,
              rentedAt: new Date().toISOString(),
            };
          }
          return listing;
        });
        localStorage.setItem("mineForNowListings", JSON.stringify(updatedListings));

        // Sync with backend API
        rentedItemIds.forEach((id) => {
          fetch(`http://localhost:5000/api/items/${id}/availability`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isAvailable: false,
              availabilityStatus: "Rented",
              rentedBy: currentUser?.id,
            }),
          }).catch(() => {});
        });

        localStorage.removeItem("mineForNowCart");

        setProcessing(false);
        setPaymentSuccess(true);

        navigate("/order-confirmed", {
          state: {
            itemCount: cartItems.length,
            dueToday: totalAmount,
            totalDeposit: paymentInfo.totalDeposit || 0,
            paid: methodUsed !== "cod",
            paymentMethod: methodUsed,
          },
        });
      } else {
        // Mode === "request" (paying for approved request)
        let rentedTargetItemId = null;
        const updatedRequests = existingRequests.map((req) => {
          if (req.id === paymentInfo.requestId) {
            rentedTargetItemId = req.itemId;
            return {
              ...req,
              status: "Confirmed",
              paymentStatus: methodUsed === "cod" ? "PendingOnDelivery" : "Paid",
              paymentMethod: methodUsed.toUpperCase(),
            };
          }
          return req;
        });

        localStorage.setItem(
          "mineForNowRentalRequests",
          JSON.stringify(updatedRequests)
        );

        // Mark this single approved item as unavailable to others
        if (rentedTargetItemId) {
          const allListings = JSON.parse(
            localStorage.getItem("mineForNowListings") || "[]"
          );
          const updatedListings = allListings.map((listing) => {
            if (String(listing.id) === String(rentedTargetItemId)) {
              return {
                ...listing,
                availability: "unavailable",
                isAvailable: false,
                availabilityStatus: "Rented",
                rentedBy: currentUser?.id || currentUser?.email || "current_user",
                renterName: renterName,
                rentedAt: new Date().toISOString(),
              };
            }
            return listing;
          });
          localStorage.setItem("mineForNowListings", JSON.stringify(updatedListings));

          fetch(`http://localhost:5000/api/items/${rentedTargetItemId}/availability`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isAvailable: false,
              availabilityStatus: "Rented",
              rentedBy: currentUser?.id,
            }),
          }).catch(() => {});
        }

        setProcessing(false);
        setPaymentSuccess(true);

        navigate("/order-confirmed", {
          state: {
            itemCount: 1,
            dueToday: totalAmount,
            totalDeposit: paymentInfo.securityDeposit || 0,
            paid: methodUsed !== "cod",
            paymentMethod: methodUsed,
          },
        });
      }
    }, 1200);
  };

  // Optional Razorpay Gateway Trigger
  const handleRazorpayPayment = async () => {
    try {
      setProcessing(true);
      const bookingId = paymentInfo.requestId || "demo_booking_" + Date.now();

      const res = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) {
        // Backend not running or simulated
        completeOrder("razorpay");
        return;
      }

      const orderData = await res.json();
      if (!orderData.success) {
        completeOrder("razorpay");
        return;
      }

      // If keys are not configured in .env (running in simulated dev mode),
      // DO NOT call window.Razorpay because Razorpay's live servers reject mock keys.
      const isSimulatedKey =
        orderData.isMock ||
        !orderData.keyId ||
        orderData.keyId === "rzp_test_mock_mode" ||
        orderData.keyId === "rzp_test_your_key_id" ||
        orderData.keyId.includes("mock");

      if (isSimulatedKey) {
        // Complete smoothly in demo/simulated mode
        setTimeout(() => {
          completeOrder("razorpay");
        }, 600);
        return;
      }

      // Real Razorpay credentials configured! Open authentic Razorpay checkout
      if (window.Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "MineForNow Rentals",
          description: "Payment for rental booking",
          order_id: orderData.orderId,
          handler: async function (response) {
            completeOrder("razorpay");
          },
          prefill: {
            name: currentUser?.name || "Renter",
            email: currentUser?.email || "user@minefornow.com",
            contact: currentUser?.phone || "9876543210",
          },
          theme: {
            color: "#b15d45",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          alert(`Payment Failed: ${response.error?.description || "Transaction cancelled."}`);
          setProcessing(false);
        });
        rzp.open();
        setProcessing(false);
      } else {
        completeOrder("razorpay");
      }
    } catch (err) {
      console.warn("Razorpay gateway fallback:", err);
      completeOrder("razorpay");
    }
  };

  // Card Submit Handler
  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s/g, "");
    if (cleanNum.length < 15) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      alert("Please enter a valid expiry date (MM / YY).");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      alert("Please enter a valid 3 or 4-digit CVV.");
      return;
    }
    completeOrder("card");
  };

  // Apply Gift Card
  const handleApplyGiftCard = (e) => {
    e.preventDefault();
    if (giftCardNumber.length < 10 || giftCardPin.length < 4) {
      alert("Please enter a valid 16-digit Gift Card number and 6-digit PIN.");
      return;
    }
    setGiftApplied(true);
    alert("Gift Card applied! ₹100 discount deducted from your balance.");
  };

  return (
    <div className="payment-checkout-page">
      <div className="payment-checkout-wrapper">
        {/* HEADER BAR */}
        <header className="payment-navbar-header">
          <button
            type="button"
            className="payment-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span>Complete Payment</span>
          </button>
          <div className="payment-badge-secure">
            <Lock size={15} />
            <span>100% Secure</span>
          </div>
        </header>

        {/* 3-COLUMN MAIN LAYOUT */}
        <div className="payment-main-grid">
          {/* =========================================
              LEFT COLUMN: PAYMENT METHODS SELECTOR
             ========================================= */}
          <section className="payment-methods-column" aria-label="Payment Options">
            {/* 1. UPI */}
            <div
              className={`payment-method-card ${
                selectedMethod === "upi" ? "active" : ""
              }`}
              onClick={() => setSelectedMethod("upi")}
              role="button"
              tabIndex={0}
            >
              <div className="method-icon-box upi-icon-box">
                <span className="upi-text-icon">UPI</span>
              </div>
              <div className="method-details">
                <h3 className="method-title">UPI</h3>
                <p className="method-subtitle">Pay by any UPI app</p>
              </div>
              {selectedMethod === "upi" && <div className="active-arrow" />}
            </div>

            {/* 2. Credit / Debit / ATM Card */}
            <div
              className={`payment-method-card ${
                selectedMethod === "card" ? "active" : ""
              }`}
              onClick={() => setSelectedMethod("card")}
              role="button"
              tabIndex={0}
            >
              <div className="method-icon-box">
                <CreditCard size={20} />
              </div>
              <div className="method-details">
                <h3 className="method-title">Credit / Debit / ATM Card</h3>
                <p className="method-subtitle">
                  Add and secure cards as per RBI guidelines
                </p>
                <span className="method-tag-offer">
                  Get upto 5% cashback • 2 offers available
                </span>
              </div>
              {selectedMethod === "card" && <div className="active-arrow" />}
            </div>

            {/* 3. Cash on Delivery */}
            <div
              className={`payment-method-card ${
                selectedMethod === "cod" ? "active" : ""
              }`}
              onClick={() => setSelectedMethod("cod")}
              role="button"
              tabIndex={0}
            >
              <div className="method-icon-box">
                <Banknote size={20} />
              </div>
              <div className="method-details">
                <h3 className="method-title">Cash on Delivery</h3>
              </div>
              {selectedMethod === "cod" && <div className="active-arrow" />}
            </div>

            {/* 4. Gift Card */}
            <div
              className={`payment-method-card ${
                selectedMethod === "gift" ? "active" : ""
              }`}
              onClick={() => setSelectedMethod("gift")}
              role="button"
              tabIndex={0}
            >
              <div className="method-icon-box">
                <Gift size={20} />
              </div>
              <div className="method-details">
                <h3 className="method-title">Have a MineForNow Gift Card?</h3>
              </div>
              {selectedMethod === "gift" && <div className="active-arrow" />}
            </div>

            {/* 5. EMI */}
            <div
              className={`payment-method-card disabled ${
                selectedMethod === "emi" ? "active" : ""
              }`}
              onClick={() => setSelectedMethod("emi")}
              role="button"
              tabIndex={0}
            >
              <div className="method-icon-box">
                <Percent size={18} />
              </div>
              <div className="method-details emi-row">
                <h3 className="method-title">EMI</h3>
                <span className="emi-unavailable-badge">
                  Unavailable <HelpCircle size={13} />
                </span>
              </div>
            </div>
          </section>

          {/* =========================================
              MIDDLE COLUMN: ACTIVE DETAIL PANEL
             ========================================= */}
          <main className="payment-detail-column">
            {/* VIEW 1: UPI SCAN & PAY */}
            {selectedMethod === "upi" && (
              <div className="payment-panel upi-panel">
                <h2 className="panel-heading">Scan QR and Pay</h2>

                <div className="upi-qr-card">
                  <div className="upi-amount-header">
                    <span className="amount-label">AMOUNT</span>
                    <strong className="amount-value">₹{totalAmount}</strong>
                  </div>

                  {/* QR Code Container */}
                  <div className="qr-code-wrapper">
                    <div className={`qr-matrix-box ${!showQr ? "blurred" : ""}`}>
                      <svg
                        className="qr-matrix-svg"
                        viewBox="0 0 160 160"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Finder pattern Top-Left */}
                        <rect x="10" y="10" width="40" height="40" rx="3" fill="#1e293b" />
                        <rect x="16" y="16" width="28" height="28" rx="2" fill="#ffffff" />
                        <rect x="22" y="22" width="16" height="16" rx="1" fill="#1e293b" />

                        {/* Finder pattern Top-Right */}
                        <rect x="110" y="10" width="40" height="40" rx="3" fill="#1e293b" />
                        <rect x="116" y="16" width="28" height="28" rx="2" fill="#ffffff" />
                        <rect x="122" y="22" width="16" height="16" rx="1" fill="#1e293b" />

                        {/* Finder pattern Bottom-Left */}
                        <rect x="10" y="110" width="40" height="40" rx="3" fill="#1e293b" />
                        <rect x="16" y="116" width="28" height="28" rx="2" fill="#ffffff" />
                        <rect x="22" y="122" width="16" height="16" rx="1" fill="#1e293b" />

                        {/* Data bits simulating real QR code */}
                        <rect x="58" y="12" width="8" height="8" fill="#1e293b" />
                        <rect x="74" y="12" width="8" height="8" fill="#1e293b" />
                        <rect x="90" y="12" width="8" height="8" fill="#1e293b" />

                        <rect x="58" y="28" width="8" height="8" fill="#1e293b" />
                        <rect x="82" y="28" width="8" height="8" fill="#1e293b" />

                        <rect x="58" y="44" width="8" height="8" fill="#1e293b" />
                        <rect x="74" y="44" width="8" height="8" fill="#1e293b" />
                        <rect x="90" y="44" width="8" height="8" fill="#1e293b" />

                        <rect x="12" y="58" width="8" height="8" fill="#1e293b" />
                        <rect x="28" y="58" width="8" height="8" fill="#1e293b" />
                        <rect x="44" y="58" width="8" height="8" fill="#1e293b" />
                        <rect x="60" y="60" width="12" height="12" fill="#b15d45" rx="2" />
                        <rect x="80" y="60" width="12" height="12" fill="#b15d45" rx="2" />
                        <rect x="100" y="58" width="8" height="8" fill="#1e293b" />
                        <rect x="120" y="58" width="8" height="8" fill="#1e293b" />
                        <rect x="140" y="58" width="8" height="8" fill="#1e293b" />

                        <rect x="12" y="74" width="8" height="8" fill="#1e293b" />
                        <rect x="36" y="74" width="8" height="8" fill="#1e293b" />
                        <rect x="70" y="78" width="18" height="18" fill="#b15d45" rx="3" />
                        <rect x="108" y="74" width="8" height="8" fill="#1e293b" />
                        <rect x="132" y="74" width="8" height="8" fill="#1e293b" />

                        <rect x="12" y="90" width="8" height="8" fill="#1e293b" />
                        <rect x="28" y="90" width="8" height="8" fill="#1e293b" />
                        <rect x="44" y="90" width="8" height="8" fill="#1e293b" />
                        <rect x="100" y="90" width="8" height="8" fill="#1e293b" />
                        <rect x="124" y="90" width="8" height="8" fill="#1e293b" />
                        <rect x="140" y="90" width="8" height="8" fill="#1e293b" />

                        <rect x="58" y="108" width="8" height="8" fill="#1e293b" />
                        <rect x="82" y="108" width="8" height="8" fill="#1e293b" />
                        <rect x="110" y="110" width="8" height="8" fill="#1e293b" />
                        <rect x="130" y="110" width="8" height="8" fill="#1e293b" />

                        <rect x="58" y="126" width="8" height="8" fill="#1e293b" />
                        <rect x="74" y="126" width="8" height="8" fill="#1e293b" />
                        <rect x="94" y="126" width="8" height="8" fill="#1e293b" />
                        <rect x="118" y="126" width="8" height="8" fill="#1e293b" />
                        <rect x="138" y="126" width="8" height="8" fill="#1e293b" />

                        <rect x="58" y="142" width="8" height="8" fill="#1e293b" />
                        <rect x="86" y="142" width="8" height="8" fill="#1e293b" />
                        <rect x="108" y="142" width="8" height="8" fill="#1e293b" />
                        <rect x="132" y="142" width="8" height="8" fill="#1e293b" />
                      </svg>

                      {/* CENTER OVERLAY BUTTON (Flipkart style) */}
                      {!showQr && (
                        <button
                          type="button"
                          className="btn-show-qr"
                          onClick={() => setShowQr(true)}
                        >
                          Show QR code
                        </button>
                      )}
                    </div>

                    {showQr && (
                      <div className="qr-active-meta">
                        <div className="qr-timer-pill">
                          <Clock size={13} />
                          <span>Expires in {formatTimer(qrTimer)}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-hide-qr"
                          onClick={() => setShowQr(false)}
                        >
                          Hide QR code
                        </button>
                      </div>
                    )}
                  </div>

                  {/* UPI APP LOGOS ROW */}
                  <div className="upi-apps-row">
                    {/* Google Pay */}
                    <div className="upi-app-icon gpay" title="Google Pay">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          fill="#4285F4"
                          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.1-4.3 1.1-3 0-5.5-2-6.4-4.8L1.9 16.3C3.7 20.2 7.5 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.6 13.4c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.9 5.7C1.1 7.3.7 9.1.7 11s.4 3.7 1.2 5.3l3.7-2.9z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 9.5c1.1 0 2.1.4 2.8 1.1l2.1-2.1C15.6 7.3 13.9 6.5 12 6.5c-3.1 0-5.7 1.9-6.7 4.6l3.7 2.9c.5-2.6 2.8-4.5 5.5-4.5z"
                        />
                      </svg>
                    </div>

                    {/* PhonePe */}
                    <div className="upi-app-icon phonepe" title="PhonePe">
                      <div className="phonepe-circle">पे</div>
                    </div>

                    {/* Paytm */}
                    <div className="upi-app-icon paytm" title="Paytm">
                      <span className="paytm-dark">Pay</span>
                      <span className="paytm-cyan">tm</span>
                    </div>

                    {/* BHIM */}
                    <div className="upi-app-icon bhim" title="BHIM UPI">
                      <span className="bhim-flag">▲</span>
                      <span className="bhim-txt">BHIM</span>
                    </div>
                  </div>

                  <p className="upi-apps-subtext">or any other UPI app</p>
                </div>

                {/* Do not hit back warning */}
                <p className="panel-security-note">
                  Do not hit back or close this screen until the transaction is complete
                </p>

                {/* Confirm or Simulated Pay Button */}
                <div className="upi-action-buttons">
                  <button
                    type="button"
                    className="payment-theme-btn"
                    disabled={processing}
                    onClick={() => completeOrder("upi")}
                  >
                    {processing ? "Verifying Payment..." : `Paid via UPI? Confirm Order`}
                  </button>
                  <button
                    type="button"
                    className="btn-razorpay-link"
                    onClick={handleRazorpayPayment}
                  >
                    Or Pay via Razorpay Gateway &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: CREDIT / DEBIT / ATM CARD */}
            {selectedMethod === "card" && (
              <form
                className="payment-panel card-panel"
                onSubmit={handleCardSubmit}
              >
                <div className="form-input-group">
                  <label htmlFor="cardNum">Card Number</label>
                  <div className="card-input-wrapper">
                    <input
                      id="cardNum"
                      type="text"
                      className="input-field"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                    <div className="card-brand-indicator">
                      {getCardBrand() ? (
                        <span className="brand-text">{getCardBrand()}</span>
                      ) : (
                        <CreditCard size={18} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-input-row">
                  <div className="form-input-group">
                    <label htmlFor="cardExp">Valid Thru</label>
                    <input
                      id="cardExp"
                      type="text"
                      className="input-field"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={7}
                      required
                    />
                  </div>

                  <div className="form-input-group">
                    <label htmlFor="cardCvv">
                      CVV{" "}
                      <span className="cvv-tooltip" title="3 or 4 digit security code on back of card">
                        <HelpCircle size={14} />
                      </span>
                    </label>
                    <input
                      id="cardCvv"
                      type="password"
                      className="input-field"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* PRIMARY PAY BUTTON */}
                <button
                  type="submit"
                  className="payment-theme-btn card-pay-btn"
                  disabled={processing}
                >
                  {processing ? "Processing Payment..." : `Pay ₹${totalAmount}`}
                </button>

                <p className="card-online-notice">
                  Note: Please ensure your card can be used for online transactions.{" "}
                  <a href="#learn" onClick={(e) => e.preventDefault()}>
                    Learn More
                  </a>
                </p>
              </form>
            )}

            {/* VIEW 3: CASH ON DELIVERY */}
            {selectedMethod === "cod" && (
              <div className="payment-panel cod-panel">
                <p className="cod-notice-text">
                  Due to handling costs, a nominal fee of ₹10 will be charged for
                  orders placed using this option. Avoid this fee by paying online
                  now.
                </p>

                <button
                  type="button"
                  className="payment-theme-btn"
                  disabled={processing}
                  onClick={() => completeOrder("cod")}
                >
                  {processing ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            )}

            {/* VIEW 4: GIFT CARD */}
            {selectedMethod === "gift" && (
              <form
                className="payment-panel gift-panel"
                onSubmit={handleApplyGiftCard}
              >
                <h2 className="panel-heading">Redeem Gift Card</h2>

                <div className="form-input-group">
                  <label htmlFor="giftNum">Gift Card Number</label>
                  <input
                    id="giftNum"
                    type="text"
                    className="input-field"
                    placeholder="16 digit card number"
                    value={giftCardNumber}
                    onChange={(e) => setGiftCardNumber(e.target.value.slice(0, 16))}
                    required
                  />
                </div>

                <div className="form-input-group">
                  <label htmlFor="giftPin">Gift Card PIN</label>
                  <input
                    id="giftPin"
                    type="password"
                    className="input-field"
                    placeholder="6 digit PIN"
                    value={giftCardPin}
                    onChange={(e) => setGiftCardPin(e.target.value.slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="payment-theme-btn"
                  disabled={giftApplied}
                >
                  {giftApplied ? "Gift Card Applied (-₹100)" : "Apply Gift Card"}
                </button>

                <p className="card-online-notice">
                  Gift cards can be combined with other payment modes. Balance will
                  be automatically adjusted.
                </p>
              </form>
            )}

            {/* VIEW 5: EMI (UNAVAILABLE) */}
            {selectedMethod === "emi" && (
              <div className="payment-panel emi-panel">
                <div className="emi-disabled-card">
                  <AlertCircle size={32} className="alert-icon" />
                  <h3>EMI Currently Unavailable</h3>
                  <p>
                    Easy Monthly Installment (EMI) options are available only on
                    orders with a rental subtotal above ₹5,000.
                  </p>
                  <button
                    type="button"
                    className="btn-switch-upi"
                    onClick={() => setSelectedMethod("upi")}
                  >
                    Pay with UPI Instead
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* =========================================
              RIGHT COLUMN: PRICE DETAILS & CASHBACK
             ========================================= */}
          <aside className="payment-summary-column" aria-label="Order Price Details">
            {/* PRICE BREAKDOWN CARD */}
            <div className="price-summary-card">
              {/* MRP Row */}
              <div className="summary-item-row">
                <span className="summary-item-title">
                  MRP (incl. of all taxes)
                </span>
                <span className="summary-item-amount">₹{baseMrp}</span>
              </div>

              {/* FEES ACCORDION */}
              <div className="summary-accordion-section">
                <div
                  className="accordion-header"
                  onClick={() => setFeesExpanded(!feesExpanded)}
                >
                  <span className="accordion-label">Fees</span>
                  {feesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {feesExpanded && (
                  <div className="accordion-body">
                    {selectedMethod === "cod" && (
                      <div className="sub-item-row">
                        <span className="sub-item-name underline-dashed">
                          Payment Handling Fee
                        </span>
                        <span className="sub-item-val">₹{codHandlingFee}</span>
                      </div>
                    )}
                    <div className="sub-item-row">
                      <span className="sub-item-name">Platform Fee</span>
                      <span className="sub-item-val">₹{platformFee}</span>
                    </div>
                    <div className="sub-item-row">
                      <span className="sub-item-name">Handling Fee</span>
                      <span className="sub-item-val">₹{handlingFee}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DISCOUNTS ACCORDION */}
              <div className="summary-accordion-section">
                <div
                  className="accordion-header"
                  onClick={() => setDiscountsExpanded(!discountsExpanded)}
                >
                  <span className="accordion-label">Discounts</span>
                  {discountsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {discountsExpanded && (
                  <div className="accordion-body">
                    <div className="sub-item-row">
                      <span className="sub-item-name">MRP Discount</span>
                      <span className="sub-item-val discount-val">-₹{mrpDiscount}</span>
                    </div>
                    <div className="sub-item-row">
                      <span className="sub-item-name">Coupons for you</span>
                      <span className="sub-item-val discount-val">-₹{couponDiscount}</span>
                    </div>
                    {giftApplied && (
                      <div className="sub-item-row">
                        <span className="sub-item-name">Gift Card Voucher</span>
                        <span className="sub-item-val discount-val">-₹100</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TOTAL AMOUNT BLUE BAR */}
              <div className="summary-total-bar">
                <span className="total-label">Total Amount</span>
                <span className="total-amount-val">₹{totalAmount}</span>
              </div>
            </div>

            {/* 5% CASHBACK BANNER */}
            <div className="cashback-offer-card">
              <div className="cashback-content">
                <h4 className="cashback-title">5% Cashback</h4>
                <p className="cashback-subtitle">
                  Claim now with payment offers
                </p>
              </div>

              {/* Bank Badges (SBI & Axis) */}
              <div className="bank-badges-cluster">
                {/* SBI Badge */}
                <div className="bank-circle-badge sbi-badge" title="State Bank of India">
                  <div className="sbi-keyhole" />
                </div>

                {/* Axis Bank Badge */}
                <div className="bank-circle-badge axis-badge" title="Axis Bank">
                  <div className="axis-chevron">▲</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Payment;
