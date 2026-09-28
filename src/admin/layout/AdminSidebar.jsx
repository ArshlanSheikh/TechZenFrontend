import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BriefcaseBusiness, Building2, ChevronLeft, CircleHelp, Gauge, Inbox, Layers3, Menu, Settings, Users } from "lucide-react";
import styles from "./AdminSidebar.module.css";

const modules = [
  { to: "/admin", label: "Overview", icon: Gauge, end: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { to: "/admin/team", label: "Our team", icon: Users },
  { to: "/admin/services", label: "Services", icon: Layers3 },
  { to: "/admin/faqs", label: "FAQ", icon: CircleHelp },
  { to: "/admin/company", label: "Company", icon: Building2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button className={styles.mobileToggle} type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle admin navigation">
        <Menu size={20} />
      </button>
      {mobileOpen && <button className={styles.scrim} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.sectionLabel}>{!collapsed && "WORKSPACE"}</div>
        <nav aria-label="Admin modules">
          {modules.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`} title={collapsed ? label : undefined}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          {!collapsed && <span>CONTENT MANAGEMENT</span>}
          <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <ChevronLeft size={17} className={collapsed ? styles.flip : ""} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}