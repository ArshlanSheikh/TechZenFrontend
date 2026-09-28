import { useEffect, useState } from "react";
import { publicContentApi } from "../../Api/CmsApi";
import styles from "./AdminPages.module.css";

const initial = { name: "TechZen", descriptor: "", email: "", phone: "", location: "", hours: "", introduction: "", about: "", mission: "", vision: "", whyChooseUs: "", statistics: "" };
const toLines = (entries, left, right) => (entries || []).map((entry) => `${entry[left] || ""} | ${entry[right] || ""}`).join("\n");
const fromLines = (value, left, right) => value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
  const separator = line.indexOf("|");
  return { [left]: (separator < 0 ? line : line.slice(0, separator)).trim(), [right]: separator < 0 ? "" : line.slice(separator + 1).trim() };
});

export default function CompanyEditor() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    publicContentApi.company().then((content) => {
      if (!content) return;
      setForm({
        name: content.name || "TechZen",
        descriptor: content.descriptor || "",
        email: content.email || "",
        phone: content.phone || "",
        location: content.location || "",
        hours: content.hours || "",
        introduction: content.introduction || "",
        about: content.about || "",
        mission: content.mission || "",
        vision: content.vision || "",
        whyChooseUs: toLines(content.whyChooseUs, "title", "description"),
        statistics: toLines(content.statistics, "label", "value"),
      });
    }).catch((requestError) => setError(requestError.response?.data?.message || "Company content could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await publicContentApi.updateCompany({
        name: form.name,
        descriptor: form.descriptor,
        email: form.email,
        phone: form.phone,
        location: form.location,
        hours: form.hours,
        introduction: form.introduction,
        about: form.about,
        mission: form.mission,
        vision: form.vision,
        whyChooseUs: fromLines(form.whyChooseUs, "title", "description"),
        statistics: fromLines(form.statistics, "label", "value"),
      });
      setNotice("Company content saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Company content could not be saved.");
    } finally { setSaving(false); }
  };

  return (
    <section>
      <header className={styles.pageHeader}><div><p className={styles.eyebrow}>WEBSITE CONTENT</p><h1>Company / About</h1><p>Edit shared company content used by public pages.</p></div></header>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {loading ? <div className={styles.loading}>Loading company content...</div> : <form className={styles.companyForm} onSubmit={save}>
        {["name", "descriptor", "email", "phone", "location", "hours"].map((name) => <label className={styles.field} key={name}><span>{name[0].toUpperCase() + name.slice(1)}</span><input type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /></label>)}
        {[["introduction", "Company introduction"], ["about", "About"], ["mission", "Mission"], ["vision", "Vision"], ["whyChooseUs", "Why choose us (one title | description per line)"], ["statistics", "Statistics (one label | value per line)"]].map(([name, label]) => <label className={styles.field} key={name}><span>{label}</span><textarea rows={name === "about" || name === "whyChooseUs" || name === "statistics" ? 5 : 3} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} /></label>)}
        <button className={styles.primaryButton} type="submit" disabled={saving}>{saving ? "Saving..." : "Save company content"}</button>
      </form>}
    </section>
  );
}