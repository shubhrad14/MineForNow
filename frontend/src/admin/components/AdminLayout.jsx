import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <AdminSidebar
        isOpen={true}
        onClose={() => {}}
      />

      <main className="admin-layout-content">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;