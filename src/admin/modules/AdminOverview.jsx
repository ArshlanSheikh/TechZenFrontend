import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicContentApi } from "../../Api/CmsApi";
import styles from "./AdminPages.module.css";

const metrics = [
  ["Total inquiries", (data) => data.inquiries.total],
  ["Pending inquiries", (data) => data.inquiries.pending],
  ["Contacted", (data) => data.inquiries.contacted],
  ["Completed", (data) => data.inquiries.completed],
  ["Total projects", (data) => data.projects.total],
  ["Team members", (data) => data.teamMembers],
  ["Active services", (data) => data.services],
  ["Active FAQs", (data) => data.faqs],
];

const dateLabel = (value) => value ? new Date(value).toLocaleDateString() : "";

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    publicContentApi.overview().then(setOverview).catch((requestError) => {
      setError(requestError.response?.data?.message || "Dashboard data could not be loaded.");
    });
  }, []);

  return (
    <section>
      <header className={styles.pageHeader}>
        <div><p className={styles.eyebrow}>TECHZEN / OVERVIEW</p><h1>Dashboard</h1><p>Website activity and content at a glance.</p></div>
      </header>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {!overview && !error ? <div className={styles.loading} role="status">Loading dashboard...</div> : overview && <>
        <div className={styles.statGrid}>
          {metrics.map(([label, getValue]) => <article className={styles.statCard} key={label}><span>{label}</span><strong>{getValue(overview)}</strong></article>)}
        </div>
        <div className={styles.overviewColumns}>
          <section className={styles.overviewPanel}>
            <header><h2>Recent inquiries</h2></header>
            {overview.inquiries.recent.length ? overview.inquiries.recent.map((item) => <Link className={styles.recentRow} key={item._id} to="/admin/inquiries"><span>{item.name} · {item.service}</span><span>{dateLabel(item.createdAt)}</span></Link>) : <p className={styles.loading}>No inquiries yet.</p>}
          </section>
          <section className={styles.overviewPanel}>
            <header><h2>Recent projects</h2></header>
            {overview.projects.recent.length ? overview.projects.recent.map((item) => <Link className={styles.recentRow} key={item._id} to="/admin/projects"><span>{item.title}</span><span>{item.category || "Project"}</span></Link>) : <p className={styles.loading}>No published projects yet.</p>}
          </section>
        </div>
      </>}
    </section>
  );
}