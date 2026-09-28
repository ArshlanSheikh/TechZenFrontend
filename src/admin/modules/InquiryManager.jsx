import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Trash2, X } from "lucide-react";
import { inquiriesApi } from "../../Api/CmsApi";
import styles from "./AdminPages.module.css";

const statuses = ["pending", "contacted", "in-progress", "completed", "rejected"];
const dateTime = (value) => value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

export default function InquiryManager() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try { setItems(await inquiriesApi.list()); }
    catch (requestError) { setError(requestError.response?.data?.message || "Could not load inquiries."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const matchesStatus = filter === "all" || item.status === filter || (filter === "pending" && item.status === "new");
    const term = query.trim().toLowerCase();
    const matchesSearch = !term || [item.name, item.email, item.company, item.service, item.message].some((value) => value?.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  }), [items, filter, query]);

  const updateStatus = async (item, status) => {
    setError("");
    try {
      const updated = await inquiriesApi.update(item._id, { status });
      setItems((current) => current.map((entry) => entry._id === item._id ? updated : entry));
      if (selected?._id === item._id) setSelected(updated);
    } catch (requestError) { setError(requestError.response?.data?.message || "Status could not be updated."); }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete the inquiry from ${item.name}? This cannot be undone.`)) return;
    try {
      await inquiriesApi.remove(item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setSelected(null);
    } catch (requestError) { setError(requestError.response?.data?.message || "Inquiry could not be deleted."); }
  };

  return (
    <section>
      <header className={styles.pageHeader}><div><p className={styles.eyebrow}>CLIENT RELATIONSHIPS</p><h1>Inquiries</h1><p>Review incoming requests and record the next step.</p></div></header>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, service, message" /></label>
        <select className={styles.filterSelect} value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter inquiries by status">
          <option value="all">All statuses</option>{statuses.map((status) => <option value={status} key={status}>{status.replace("-", " ")}</option>)}
        </select>
        <span>{filtered.length} inquiries</span>
      </div>
      <div className={styles.tableFrame}>
        <table className={styles.table}>
          <thead><tr><th>Contact</th><th>Request</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className={styles.empty}>Loading inquiries...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan="5" className={styles.empty}>No inquiries match this view.</td></tr>
                : filtered.map((item) => <tr key={item._id}>
                  <td className={styles.inquiryInfo}><strong>{item.name}</strong><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}</td>
                  <td><strong>{item.service}</strong><div className={styles.messageCell} title={item.message}>{item.message}</div><small>{item.company && item.company !== "private" ? item.company : "Individual"} · {item.contactMethod || "Email"}</small></td>
                  <td>{dateTime(item.createdAt)}</td>
                  <td><select className={styles.statusSelect} value={item.status === "new" ? "pending" : item.status} onChange={(event) => updateStatus(item, event.target.value)} aria-label={`Status for ${item.name}`}>{statuses.map((status) => <option key={status} value={status}>{status.replace("-", " ")}</option>)}</select></td>
                  <td className={styles.actions}><button type="button" onClick={() => setSelected(item)} title="View details" aria-label="View details"><Eye size={16} /></button><button type="button" onClick={() => remove(item)} title="Delete inquiry" aria-label="Delete inquiry"><Trash2 size={16} /></button></td>
                </tr>)}
          </tbody>
        </table>
      </div>

      {selected && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="inquiry-detail-title">
          <header><div><p className={styles.eyebrow}>INQUIRY DETAILS</p><h2 id="inquiry-detail-title">{selected.name}</h2></div><button className={styles.iconButton} type="button" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button></header>
          <dl className={styles.detailGrid}>
            <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{selected.phone || "—"}</dd></div>
            <div><dt>Company</dt><dd>{selected.company || "—"}</dd></div>
            <div><dt>Requested service</dt><dd>{selected.service}</dd></div>
            <div><dt>Preferred contact</dt><dd>{selected.contactMethod || "Email"}</dd></div>
            <div><dt>Received</dt><dd>{dateTime(selected.createdAt)}</dd></div>
            <div><dt>Status</dt><dd>{(selected.status || "pending").replace("-", " ")}</dd></div>
            <div className={styles.detailMessage}><dt>Message</dt><dd>{selected.message}</dd></div>
          </dl>
        </section>
      </div>}
    </section>
  );
}