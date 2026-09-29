import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { contentApi, uploadImage } from "../../Api/CmsApi";
import styles from "./AdminPages.module.css";

const emptyForm = (config) => Object.fromEntries(config.fields.map(({ name }) => [name, config.defaults?.[name] ?? (name === "technologies" || name === "features" ? [] : "")]));

export default function CmsContentManager({ config }) {
  const api = useMemo(() => contentApi(config.api), [config.api]);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(() => emptyForm(config));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try { setItems(await api.list()); }
    catch (requestError) { setError(requestError.response?.data?.message || "Could not load this content."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [api]);

  const visible = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return items;
    return items.filter((item) => config.searchable.some((field) => String(item[field] || "").toLowerCase().includes(term)));
  }, [items, query, config]);

  const openCreate = () => { setEditing(null); setForm(emptyForm(config)); setFormOpen(true); setError(""); setNotice(""); };
  const openEdit = (item) => {
    setEditing(item._id);
    setFormOpen(true);
    setForm(Object.fromEntries(config.fields.map(({ name }) => [name, item[name] ?? config.defaults?.[name] ?? (name === "features" || name === "technologies" ? [] : "")])));
    setError("");
    setNotice("");
  };
  const closeForm = () => setFormOpen(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      for (const field of config.fields) {
        if (field.type === "number") payload[field.name] = Number(payload[field.name] || 0);
        if (field.type === "list") payload[field.name] = Array.isArray(payload[field.name]) ? payload[field.name] : payload[field.name].split(",").map((item) => item.trim()).filter(Boolean);
      }
      if (import.meta.env.DEV) {
        console.info("[cms save] started", {
          resource: config.api,
          operation: editing ? "update" : "create",
          hasImageUrl: typeof payload.image === "string" && Boolean(payload.image.trim()),
        });
      }
      if (editing) await api.update(editing, payload);
      else await api.create(payload);
      if (import.meta.env.DEV) console.info("[cms save] succeeded", { resource: config.api });
      setFormOpen(false);
      setNotice(editing ? "Changes saved." : "Content created.");
      await load();
    } catch (requestError) {
      if (import.meta.env.DEV) {
        console.error("[cms save] failed", {
          status: requestError.response?.status || null,
          error: requestError.response?.data?.error || null,
          message: requestError.response?.data?.message || requestError.message,
        });
      }
      setError(requestError.response?.data?.message || "Could not save this content.");
    } finally { setSaving(false); }
  };

  const remove = async (item) => {
    const label = item.title || item.name || item.question;
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    setError("");
    try {
      await api.remove(item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setNotice("Content deleted.");
    } catch (requestError) { setError(requestError.response?.data?.message || "Could not delete this content."); }
  };

  return (
    <section>
      <header className={styles.pageHeader}>
        <div><p className={styles.eyebrow}>WEBSITE CONTENT</p><h1>{config.title}</h1><p>{config.description}</p></div>
        <button className={styles.primaryButton} type="button" onClick={openCreate}><Plus size={17} /> Add {config.title === "FAQ" ? "question" : "item"}</button>
      </header>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} /></label>
        <span>{visible.length} items</span>
      </div>

      <div className={styles.tableFrame}>
        <table className={styles.table}>
          <thead><tr>{config.columns.map(([, label]) => <th key={label}>{label}</th>)}<th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={config.columns.length + 1} className={styles.empty}>Loading content...</td></tr>
              : visible.length === 0 ? <tr><td colSpan={config.columns.length + 1} className={styles.empty}>No content yet. Add the first item to populate this section.</td></tr>
                : visible.map((item) => <tr key={item._id}>
                  {config.columns.map(([field]) => <td key={field}>{typeof item[field] === "boolean" ? <span className={item[field] ? styles.stateOn : styles.stateOff}>{item[field] ? "Active" : "Hidden"}</span> : item[field] || "—"}</td>)}
                  <td className={styles.actions}>
                    <button type="button" aria-label="Edit item" title="Edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                    <button type="button" aria-label="Delete item" title="Delete" onClick={() => remove(item)}><Trash2 size={16} /></button>
                  </td>
                </tr>)}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="content-form-title">
            <header><div><p className={styles.eyebrow}>{editing ? "EDIT CONTENT" : "NEW CONTENT"}</p><h2 id="content-form-title">{editing ? "Edit" : "Add"} {config.title}</h2></div><button type="button" className={styles.iconButton} onClick={closeForm} aria-label="Close"><X size={19} /></button></header>
            <form onSubmit={save}>
              <div className={styles.formGrid}>
                {config.fields.map((field) => <label key={field.name} className={`${styles.field} ${field.type === "checkbox" ? styles.checkField : ""}`}>
                  {field.type === "checkbox" ? <><input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.checked }))} /><span>{field.label}</span></> : <>
                    <span>{field.label}{field.required && " *"}</span>
                    {field.type === "textarea" ? <textarea rows={field.rows || 3} required={field.required} value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                      : field.type === "image" ? <>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          setError("");
                          try {
                            const imageUrl = await uploadImage(file);
                            setForm((current) => ({ ...current, [field.name]: imageUrl }));
                          } catch (uploadError) {
                            setError(uploadError.response?.data?.message || "Image upload failed.");
                          } finally {
                            setUploading(false);
                            event.target.value = "";
                          }
                        }} />
                        {form[field.name] && <img className={styles.imagePreview} src={form[field.name]} alt="Content preview" />}
                        {uploading && <small>Uploading image...</small>}
                      </>
                      : <input type={field.type === "list" ? "text" : field.type || "text"} min={field.type === "number" ? 0 : undefined} required={field.required} value={field.type === "list" && Array.isArray(form[field.name]) ? form[field.name].join(", ") : form[field.name] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} />}
                    {field.hint && <small>{field.hint}</small>}
                  </>}
                </label>)}
              </div>
              <footer><button type="button" className={styles.secondaryButton} onClick={closeForm}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={saving || uploading}>{saving ? "Saving..." : uploading ? "Uploading..." : "Save changes"}</button></footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}