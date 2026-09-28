import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./AdminHeader.module.css";

function AdminHeader({ user, onLogout }) {
  const today = new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className={styles.header}>
      <Link className={styles.brand} to="/" aria-label="TechZen home">
        <span>TECHZEN</span>
        <small>ADMIN</small>
      </Link>
      <div className={styles.right}>
        <time className={styles.date}>{today}</time>
        <div className={styles.profile}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <span className={styles.identity}>
            <strong>{name}</strong>
            <small>Administrator</small>
          </span>
        </div>
        <button className={styles.logout} type="button" onClick={onLogout} aria-label="Log out" title="Log out">
          <LogOut size={17} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;