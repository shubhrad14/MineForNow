# MineForNow – Peer-to-Peer Rental Marketplace

MineForNow is a web-based rental marketplace designed to connect people who want to rent items with people who have items available for rent. It encourages the reuse and sharing of products, helping users access items they need temporarily without purchasing them.

## Features

- **User Authentication:** Registration, login, and account-related functionality.
- **Browse and Search Items:** Explore available rental items and find products based on relevant details.
- **Item Listing:** Allow owners to list items for rent.
- **Rental Booking:** Manage rental bookings and booking requests.
- **Owner Dashboard:** Manage listed items and rental activity.
- **Admin Dashboard:** Manage platform-related information and activities.
- **Payment Module:** Provides payment-related functionality for rentals.
- **Wishlist and Cart:** Keep track of selected items.
- **User Profile:** Manage account-related information.
- **Password Reset:** Includes password-reset and OTP-related functionality.

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Development Tools
- Visual Studio Code
- Git and GitHub
- npm

## Project Structure

```text
MineForNow/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB, if using a local database, or access to a configured MongoDB service

### 1. Clone the Repository

```bash
git clone https://github.com/shubhrad14/MineForNow.git
cd MineForNow
```

### 2. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Configure the required environment variables according to the backend configuration. Do not commit passwords, API keys, or other secrets to GitHub.

Start the backend using the start script defined in `backend/package.json`. For example, if the script is named `start`:

```bash
npm start
```

### 3. Set Up the Frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Vite will display a local development URL in the terminal. Open that URL in your browser.

## Project Categories

MineForNow focuses on the following rental categories:

- Home Appliances
- Electronics
- Medical Equipment

## Future Enhancements

- Integration of a secure online payment gateway
- Notifications for booking and rental status updates
- AI-based rental recommendations
- Improved identity verification and security
- Enhanced dispute management
- Additional search and filtering options

## Purpose

MineForNow aims to make temporary access to useful products more convenient by connecting borrowers and item owners through a single digital platform.

## Repository

GitHub: https://github.com/shubhrad14/MineForNow

---

**Note:** Setup commands and features should match the current implementation. Check the scripts in `backend/package.json` and verify the database connection and payment functionality before describing them as fully operational.
