import { useEffect, useMemo, useState } from "react";
import { RotateCw, Search } from "lucide-react";
import api from "../../Api/ApiIntersceptor";
import { useAuth } from "../../Auth/AuthProvider";
import AdminHeader from "./AdminHeader/AdminHeader";
import styles from "./AdminDashbord.module.css";

const statuses = ["new", "contacted", "in-progress", "completed"];

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function AdminDashbord() {
  const { user, logout } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/v1/inquiry/all-inquiry");
      setInquiries(response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Inquiry data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInquiries();
  }, []);

  const counts = useMemo(() => ({
    all: inquiries.length,
    new: inquiries.filter((item) => item.status === "new").length,
    active: inquiries.filter((item) => ["contacted", "in-progress"].includes(item.status)).length,
    completed: inquiries.filter((item) => item.status === "completed").length,
  }), [inquiries]);

  const visibleInquiries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch = !normalizedSearch || [item.name, item.email, item.company, item.service]
        .some((value) => value?.toLowerCase().includes(normalizedSearch));
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, search, statusFilter]);

  const updateStatus = async (inquiry, status) => {
    setUpdatingId(inquiry._id);
    setError("");
    try {
      const response = await api.put(`/v1/inquiry/update/${inquiry._id}`, { status });
      const updated = response.data?.data || { ...inquiry, status };
      setInquiries((current) => current.map((item) => item._id === inquiry._id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The inquiry status could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  };

  const adminName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "TechZen admin";

  return (
    <div className={styles.dashboard}>
      <AdminHeader user={user} onLogout={logout} />
      <main className={styles.content}>
        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>TECHZEN / OPERATIONS</p>
            <h1>Inquiry desk</h1>
            <p className={styles.welcome}>Good to see you, {adminName}.</p>
          </div>
          <button className={styles.refreshButton} type="button" onClick={fetchInquiries} disabled={loading} aria-label="Refresh inquiries" title="Refresh inquiries">
            <RotateCw size={17} />
            <span>Refresh</span>
          </button>
        </section>

        <section className={styles.metrics} aria-label="Inquiry overview">
          <Metric label="All inquiries" value={counts.all} tone="ink" />
          <Metric label="New" value={counts.new} tone="coral" />
          <Metric label="In progress" value={counts.active} tone="green" />
          <Metric label="Completed" value={counts.completed} tone="blue" />
        </section>

        <section className={styles.inquirySection}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Client inquiries</h2>
              <p>Review requests and keep their next step current.</p>
            </div>
            <label className={styles.search}>
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search inquiries"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search inquiries"
              />
            </label>
          </div>

          <div className={styles.filters} role="group" aria-label="Filter inquiries by status">
            {[
              ["all", "All"],
              ["new", "New"],
              ["contacted", "Contacted"],
              ["in-progress", "In progress"],
              ["completed", "Completed"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={statusFilter === value ? styles.filterActive : ""}
                onClick={() => setStatusFilter(value)}
                aria-pressed={statusFilter === value}
              >
                {label}
                <span>{value === "all" ? counts.all : inquiries.filter((item) => item.status === value).length}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className={styles.errorState} role="alert">
              <span>{error}</span>
              <button type="button" onClick={fetchInquiries}>Try again</button>
            </div>
          )}

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Request</th>
                  <th>Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className={styles.empty} colSpan="4">Loading inquiries...</td></tr>
                ) : visibleInquiries.length === 0 ? (
                  <tr><td className={styles.empty} colSpan="4">{inquiries.length ? "No inquiries match these filters." : "No inquiries received yet."}</td></tr>
                ) : visibleInquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td>
                      <strong>{inquiry.name}</strong>
                      <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                      {inquiry.phone && <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>}
                    </td>
                    <td>
                      <strong>{inquiry.service}</strong>
                      <span className={styles.message} title={inquiry.message}>{inquiry.message}</span>
                      {inquiry.company && inquiry.company !== "private" && <small>{inquiry.company}</small>}
                    </td>
                    <td className={styles.dateCell}>{formatDate(inquiry.createdAt)}</td>
                    <td>
                      <select
                        className={`${styles.statusSelect} ${styles[`status_${inquiry.status}`] || ""}`}
                        value={inquiry.status}
                        disabled={updatingId === inquiry._id || !statuses.includes(inquiry.status)}
                        onChange={(event) => updateStatus(inquiry, event.target.value)}
                        aria-label={`Update status for ${inquiry.name}`}
                      >
                        {statuses.map((status) => <option key={status} value={status}>{status.replace("-", " ")}</option>)}
                      </select>
                      {updatingId === inquiry._id && <small className={styles.saving}>Saving...</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && <p className={styles.resultCount}>Showing {visibleInquiries.length} of {inquiries.length} inquiries</p>}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <article className={`${styles.metric} ${styles[tone]}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default AdminDashbord;