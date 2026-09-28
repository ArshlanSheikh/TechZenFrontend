import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import AdminHeader from "./layout/AdminHeader";
import AdminSidebar from "./layout/AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ""}`}>
      <AdminHeader user={user} onLogout={logout} />
      <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}