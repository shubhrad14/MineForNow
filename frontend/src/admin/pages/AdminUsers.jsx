import { useState , useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

import "./AdminUsers.css";

function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1024);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    document.body.classList.add("admin-page");

    try {
      const loggedUser = JSON.parse(
        localStorage.getItem("mineForNowUser") || "null"
      );
      if (loggedUser?.email) {
        setUsers((prev) => {
          if (prev.some((u) => u.email === loggedUser.email)) return prev;
          const userItem = {
            id: loggedUser.id ? `USR${loggedUser.id.toString().slice(-3)}` : "USR099",
            name:
              loggedUser.name ||
              (loggedUser.firstName
                ? `${loggedUser.firstName} ${loggedUser.lastName || ""}`.trim()
                : "Active User"),
            email: loggedUser.email,
            role: loggedUser.role === "owner" ? "Owner" : "Borrower",
            status: "Active",
            verified: Boolean(loggedUser.isVerified ?? true),
            joined: "Active Member",
            rentals: 2,
          };
          return [userItem, ...prev];
        });
      }
    } catch (e) {}

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  const [users, setUsers] = useState([
    {
      id: "USR001",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "Owner",
      status: "Active",
      verified: true,
      joined: "12 Sep 2026",
      rentals: 8,
    },
    {
      id: "USR002",
      name: "Priya Mehta",
      email: "priya@example.com",
      role: "Borrower",
      status: "Active",
      verified: true,
      joined: "10 Sep 2026",
      rentals: 5,
    },
    {
      id: "USR003",
      name: "Amit Kumar",
      email: "amit@example.com",
      role: "Owner",
      status: "Active",
      verified: false,
      joined: "08 Sep 2026",
      rentals: 3,
    },
    {
      id: "USR004",
      name: "Sneha Rao",
      email: "sneha@example.com",
      role: "Borrower",
      status: "Suspended",
      verified: true,
      joined: "05 Sep 2026",
      rentals: 2,
    },
    {
      id: "USR005",
      name: "Karan Patel",
      email: "karan@example.com",
      role: "Owner",
      status: "Active",
      verified: true,
      joined: "02 Sep 2026",
      rentals: 11,
    },
    {
      id: "USR006",
      name: "Neha Shah",
      email: "neha@example.com",
      role: "Borrower",
      status: "Active",
      verified: true,
      joined: "30 Aug 2026",
      rentals: 6,
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const toggleUserStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Suspended"
                  : "Active",
            }
          : user
      )
    );
  };

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "Suspended"
  ).length;

  const verifiedUsers = users.filter(
    (user) => user.verified
  ).length;

  return (
    <div className={`admin-users-page ${sidebarOpen ? "sidebar-is-open" : ""}`}>


      {/* SIDEBAR */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* MAIN CONTENT */}

      <main className="admin-users-content">

        {/* HEADER */}

        <div className="admin-users-header">

          <div className="admin-users-heading">

            <span>USER MANAGEMENT</span>

            <h1>Users</h1>

            <p>
              Manage and monitor MineForNow users.
            </p>

          </div>

          <button
            className="admin-users-menu-button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Open admin menu"
          >
            <SlidersHorizontal size={20} />
          </button>

        </div>


        {/* SUMMARY */}

        <section className="admin-user-summary">

          <div className="user-summary-item">

            <div className="user-summary-icon">
              <Users size={19} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{totalUsers}</strong>
            </div>

          </div>


          <div className="user-summary-item">

            <div className="user-summary-icon active-icon">
              <UserCheck size={19} />
            </div>

            <div>
              <span>Active Users</span>
              <strong>{activeUsers}</strong>
            </div>

          </div>


          <div className="user-summary-item">

            <div className="user-summary-icon verified-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <span>Verified Users</span>
              <strong>{verifiedUsers}</strong>
            </div>

          </div>


          <div className="user-summary-item">

            <div className="user-summary-icon suspended-icon">
              <UserX size={19} />
            </div>

            <div>
              <span>Suspended</span>
              <strong>{suspendedUsers}</strong>
            </div>

          </div>

        </section>


        {/* USER TABLE PANEL */}

        <section className="admin-users-panel">

          {/* TOOLBAR */}

          <div className="admin-users-toolbar">

            <div className="admin-user-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>


            <div className="admin-user-filters">

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
              >
                <option value="All">All Roles</option>
                <option value="Owner">Owner</option>
                <option value="Borrower">Borrower</option>
              </select>


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>

            </div>

          </div>


          {/* TABLE */}

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Joined</th>
                  <th>Rentals</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (

                    <tr key={user.id}>

                      <td>

                        <div className="admin-user-profile">

                          <div className="admin-user-avatar">
                            {user.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>

                            <strong>{user.name}</strong>

                            <span>{user.email}</span>

                            <small>{user.id}</small>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span
                          className={`user-role ${user.role.toLowerCase()}`}
                        >
                          {user.role}
                        </span>

                      </td>


                      <td>

                        <span
                          className={`user-status ${user.status.toLowerCase()}`}
                        >
                          <span className="status-dot"></span>
                          {user.status}
                        </span>

                      </td>


                      <td>

                        {user.verified ? (

                          <span className="verification verified">
                            <CheckCircle size={14} />
                            Verified
                          </span>

                        ) : (

                          <span className="verification pending">
                            Pending
                          </span>

                        )}

                      </td>


                      <td>
                        <span className="user-date">
                          {user.joined}
                        </span>
                      </td>


                      <td>
                        <strong className="rental-count">
                          {user.rentals}
                        </strong>
                      </td>


                      <td>

                        <div className="user-actions">

                          <button
                            title="View user"
                            className="user-action-button"
                          >
                            <Eye size={16} />
                          </button>


                          <button
                            title={
                              user.status === "Active"
                                ? "Suspend user"
                                : "Activate user"
                            }
                            className={`user-action-button ${
                              user.status === "Active"
                                ? "suspend-action"
                                : "activate-action"
                            }`}
                            onClick={() =>
                              toggleUserStatus(user.id)
                            }
                          >
                            {user.status === "Active" ? (
                              <Ban size={16} />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                          </button>


                          <button
                            title="More options"
                            className="user-action-button"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-users"
                    >
                      No users found.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* FOOTER */}

          <div className="admin-users-footer">

            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminUsers;