import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  CalendarDays,
  Star,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import "./AdminSidebar.css";

function AdminSidebar({ isOpen, onClose }) {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    localStorage.removeItem("mineForNowAdmin");
    navigate("/admin/login");
  };

  return (
    <aside
      ref={sidebarRef}
      className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""}`}
    >
      {/* BRAND */}
      <div className="admin-sidebar-brand">
        <div className="admin-brand-name">
          <span className="admin-brand-mine">mine</span>
          <span className="admin-brand-fornow">fornow</span>
        </div>

        <span className="admin-brand-label">ADMIN PANEL</span>
      </div>

      {/* MAIN MENU */}
      <div className="admin-sidebar-section">
        <p className="admin-sidebar-title">MAIN MENU</p>

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Users size={19} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/listings"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Package size={19} />
            <span>Listings</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <CalendarDays size={19} />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/reviews"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Star size={19} />
            <span>Reviews</span>
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <BarChart3 size={19} />
            <span>Reports</span>
          </NavLink>

        </nav>
      </div>

      {/* SYSTEM */}
      <div className="admin-sidebar-section admin-system-section">

        <p className="admin-sidebar-title">SYSTEM</p>

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>

        </nav>

      </div>

      {/* LOGOUT */}
      <div className="admin-sidebar-bottom">

        <button
          className="admin-sidebar-link admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}

export default AdminSidebar;