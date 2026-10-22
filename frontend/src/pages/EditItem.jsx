//for owner side

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./EditItem.css";

function EditItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const listings = JSON.parse(
    localStorage.getItem("mineForNowListings") || "[]"
  );

  const existingItem = listings.find(
    (item) => String(item.id) === String(id)
  );

  const [formData, setFormData] = useState({
    name: existingItem?.name || "",
    category: existingItem?.category || "",
    price: existingItem?.price || "",
    description: existingItem?.description || "",
    location: existingItem?.location || "",
    availability: existingItem?.availability || "available",
    bookingType: existingItem?.bookingType || "instant",
  });

  if (!existingItem) {
    return (
      <div className="edit-item-page">
        <div className="edit-item-container">
          <h2>Item not found</h2>

          <button
            className="back-button"
            onClick={() => navigate("/owner-dashboard")}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((existingItem?.availability === "unavailable" || existingItem?.rentedBy) && formData.availability === "available") {
      alert("This item is currently rented out to a customer. Its availability will automatically restore once the rental is completed.");
      return;
    }

    const updatedListings = listings.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            ...formData,
          }
        : item
    );

    localStorage.setItem(
      "mineForNowListings",
      JSON.stringify(updatedListings)
    );

    alert("Listing updated successfully!");

    navigate("/owner-dashboard");
  };

  return (
    <div className="edit-item-page">
      <div className="edit-item-container">

        <button
          className="back-button"
          onClick={() => navigate("/owner-dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="edit-item-heading">
          <p>MANAGE YOUR ITEM</p>
          <h1>Edit Listing</h1>
          <span>
            Update the details of your rental item.
          </span>
        </div>

        <form
          className="edit-item-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC DETAILS */}
          <section className="edit-section">

            <h2>Basic Details</h2>

            <div className="edit-group">
              <label>Item Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-row">

              <div className="edit-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Home Appliances">
                    Home Appliances
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Medical Equipment">
                    Medical Equipment
                  </option>
                </select>
              </div>

              <div className="edit-group">
                <label>Rental Price</label>

                <div className="edit-price">
                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  <small>/ day</small>
                </div>
              </div>

            </div>

            <div className="edit-group">
              <label>Description</label>

              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

          </section>

          {/* LOCATION */}
          <section className="edit-section">

            <h2>Location</h2>

            <div className="edit-group">

              <label>City</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />

            </div>

          </section>

          {/* AVAILABILITY */}
          <section className="edit-section">

            <h2>Availability & Booking</h2>

            <div className="edit-group">

              <label>Availability</label>

              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="available">
                  Available
                </option>

                <option value="unavailable">
                  Currently Unavailable
                </option>
              </select>

            </div>

            <div className="booking-options">

              <label className="booking-option">
                <input
                  type="radio"
                  name="bookingType"
                  value="instant"
                  checked={formData.bookingType === "instant"}
                  onChange={handleChange}
                />

                <div>
                  <strong>Instant Booking</strong>

                  <span>
                    Renters can book the item immediately.
                  </span>
                </div>
              </label>

              <label className="booking-option">
                <input
                  type="radio"
                  name="bookingType"
                  value="approval"
                  checked={formData.bookingType === "approval"}
                  onChange={handleChange}
                />

                <div>
                  <strong>Approval Required</strong>

                  <span>
                    Review rental requests before accepting them.
                  </span>
                </div>
              </label>

            </div>

          </section>

          {/* ACTIONS */}
          <div className="edit-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/owner-dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditItem;