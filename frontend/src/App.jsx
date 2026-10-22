import { BrowserRouter, Routes, Route } from "react-router-dom";

// =========================
// USER COMPONENTS
// =========================

import Navbar from "./components/Navbar";
import Hero from "./components/HeroSlider";
import Categories from "./components/Categories";
import OwnerCTA from "./components/Ownercta";
import PopularItems from "./components/PopularItems";
import HowItWorks from "./components/HowItWorks";
import WhyChooseUs from "./components/Whychooseus";
import RentByOccasion from "./components/RentByOccasion";
import AIRecommendations from "./components/AIRecommendations";
import Footer from "./components/Footer";

// =========================
// USER PAGES
// =========================

import Browse from "./pages/Browse";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import ModeSelection from "./pages/ModeSelection";
import OwnerDashboard from "./pages/OwnerDashboard";
import ListItem from "./pages/ListItem";
import EditItem from "./pages/EditItem";
import ItemDetails from "./pages/ItemDetails";
import MyRentals from "./pages/MyRentals";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import OTP from "./pages/OTP";
import OrderConfirmed from "./pages/Orderconfirmed";
import Payment from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";

// =========================
// ADMIN
// =========================

import AdminLogin from "./admin/auth/AdminLogin";
import AdminForgotPassword from "./admin/pages/AdminForgotPassword";
import AdminDashboard from "./admin/pages/AdminDashboard";

import AdminUsers from "./admin/pages/AdminUsers";
import AdminListings from "./admin/pages/AdminListings";
import AdminBookings from "./admin/pages/AdminBookings";
import AdminReviews from "./admin/pages/AdminReviews";
import AdminReports from "./admin/pages/AdminReports";
import AdminSettings from "./admin/pages/AdminSettings";

import "./App.css";


// =========================
// HOME
// =========================

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <OwnerCTA />
      <PopularItems />
      <HowItWorks />
      <WhyChooseUs />
      <RentByOccasion />
      <AIRecommendations />
    </>
  );
}


// =========================
// USER LAYOUT
// =========================

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// =========================
// APP
// =========================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            USER ROUTES
        ========================= */}

        <Route path="/"  element={ <UserLayout> <Home /> </UserLayout> }  />

        <Route path="/browse" element={ <UserLayout> <Browse /> </UserLayout> }  />

        <Route path="/product/:id" element={ <UserLayout> <ProductDetails /> </UserLayout>  }  />

        <Route path="/login"  element={ <UserLayout> <Login /> </UserLayout> } />

        <Route path="/forgot-password" element={ <UserLayout> <ForgotPassword /> </UserLayout> }/>

        <Route path="/mode-selection" element={ <UserLayout> <ModeSelection /> </UserLayout> } />

        <Route path="/owner-dashboard" element={ <UserLayout> <OwnerDashboard /> </UserLayout> } />

        <Route path="/list-item" element={ <UserLayout> <ListItem /> </UserLayout> } />

        <Route path="/edit-item/:id" element={ <UserLayout> <EditItem /> </UserLayout> } />

        <Route path="/item/:id" element={ <UserLayout> <ItemDetails /> </UserLayout> } />

        <Route path="/my-rentals" element={ <UserLayout> <MyRentals /> </UserLayout> } />

        <Route path="/wishlist" element={ <UserLayout> <Wishlist /> </UserLayout> } />

        <Route path="/cart" element={ <UserLayout> <Cart /> </UserLayout> } />

        <Route path="/checkout" element={ <UserLayout> <Checkout /></UserLayout> } />

        <Route path="/register" element={ <UserLayout> <Register /> </UserLayout> } />

        <Route path="/otp" element={<UserLayout><OTP /></UserLayout>} />

        <Route path="/order-confirmed" element={<OrderConfirmed />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/profile" element={ <UserLayout> <Profile /> </UserLayout> } />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />

       {/* =========================
            ADMIN LAYOUT
        ========================= */}

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/admin/listings" element={<AdminListings />} />

          <Route path="/admin/bookings" element={<AdminBookings />} />

          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
      </Routes>

    </BrowserRouter>
  );
}

export default App;