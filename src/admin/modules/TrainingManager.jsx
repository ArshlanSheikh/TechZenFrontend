import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Eye,
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  GraduationCap,
  Sparkles,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { trainingApi, uploadImage } from "../../Api/CmsApi";
import adminStyles from "./AdminPages.module.css";
import styles from "./TrainingManager.module.css";

const initialProgramForm = {
  title: "",
  slug: "",
  category: "",
  categoryName: "",
  shortDescription: "",
  description: "",
  image: "",
  duration: "3 Months",
  mode: "Hybrid",
  eligibility: "BCA, MCA, B.Tech, CS/IT Students, or Graduates",
  batchDetails: "Upcoming Batch Starting Soon",
  batchStartDate: "",
  schedule: "Mon - Fri, 2 Hours/day",
  seats: "25 Seats per batch",
  contactDetails: {
    phone: "",
    email: "",
    whatsapp: "",
  },
  pricing: {
    pricingType: "Total Program Fee",
    totalFee: "",
    discountedFee: "",
  },
  technologies: [],
  syllabus: [
    {
      sectionTitle: "Module 1: Foundations & Core Concepts",
      topics: ["Introduction to core concepts", "Development environment setup"],
    },
  ],
  learningOutcomes: [],
  projects: [],
  benefits: [
    "100% Practical Hands-on Training",
    "Live Industry Capstone Projects",
    "Certificate & Experience Letter",
    "Resume & Interview Preparation",
  ],
  certificate: {
    offered: true,
    details: "Industry-Recognized Certificate of Completion and Project Experience Letter",
  },
  faqs: [],
  features: [],
  icon: "code",
  color: "#2563eb",
  displayOrder: 0,
  isActive: true,
};

const initialCategoryForm = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 0,
  isActive: true,
};

export default function TrainingManager() {
  const [activeTab, setActiveTab] = useState("programs"); // 'programs' | 'categories'

  // Data
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Filters & Search
  const [query, setQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Program Modal State
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [viewingProgram, setViewingProgram] = useState(null);
  const [programForm, setProgramForm] = useState(initialProgramForm);
  const [savingProgram, setSavingProgram] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Temporary inputs for repeatable fields
  const [newTech, setNewTech] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newTopicBySection, setNewTopicBySection] = useState({});

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [savingCategory, setSavingCategory] = useState(false);

  // Load programs and categories
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [programsData, categoriesData] = await Promise.all([
        trainingApi.list(),
        trainingApi.listCategoriesAdmin(),
      ]);
      setPrograms(programsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load training data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Filtered programs
  const visiblePrograms = useMemo(() => {
    const term = query.toLowerCase().trim();
    return programs.filter((p) => {
      const matchesSearch =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.technologies?.some((t) => t.toLowerCase().includes(term));

      const matchesCat =
        selectedCategoryFilter === "all" ||
        p.category?._id === selectedCategoryFilter ||
        p.category === selectedCategoryFilter ||
        p.categoryName === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [programs, query, selectedCategoryFilter]);

  // Program Handlers
  const openCreateProgram = () => {
    setEditingProgramId(null);
    setProgramForm({
      ...initialProgramForm,
      category: categories[0]?._id || "",
      categoryName: categories[0]?.name || "",
    });
    setProgramModalOpen(true);
    setError("");
    setNotice("");
  };

  const openEditProgram = (item) => {
    setEditingProgramId(item._id);
    setProgramForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category?._id || item.category || "",
      categoryName: item.categoryName || item.category?.name || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      image: item.image || "",
      duration: item.duration || "3 Months",
      mode: item.mode || "Hybrid",
      eligibility: item.eligibility || "",
      batchDetails: item.batchDetails || "",
      batchStartDate: item.batchStartDate || "",
      schedule: item.schedule || "",
      seats: item.seats || "",
      contactDetails: {
        phone: item.contactDetails?.phone || "",
        email: item.contactDetails?.email || "",
        whatsapp: item.contactDetails?.whatsapp || "",
      },
      pricing: {
        pricingType: item.pricing?.pricingType || "Total Program Fee",
        totalFee: item.pricing?.totalFee || item.fee || "",
        discountedFee: item.pricing?.discountedFee || "",
      },
      technologies: Array.isArray(item.technologies) ? [...item.technologies] : [],
      syllabus: Array.isArray(item.syllabus) && item.syllabus.length > 0
        ? item.syllabus.map((s) => ({ sectionTitle: s.sectionTitle || "", topics: [...(s.topics || [])] }))
        : initialProgramForm.syllabus,
      learningOutcomes: Array.isArray(item.learningOutcomes) ? [...item.learningOutcomes] : [],
      projects: Array.isArray(item.projects) ? [...item.projects] : [],
      benefits: Array.isArray(item.benefits) ? [...item.benefits] : [...initialProgramForm.benefits],
      certificate: {
        offered: item.certificate?.offered ?? true,
        details: item.certificate?.details || initialProgramForm.certificate.details,
      },
      faqs: Array.isArray(item.faqs) ? [...item.faqs] : [],
      features: Array.isArray(item.features) ? [...item.features] : [],
      icon: item.icon || "code",
      color: item.color || "#2563eb",
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setProgramModalOpen(true);
    setError("");
    setNotice("");
  };

  const closeProgramModal = () => {
    setProgramModalOpen(false);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!programForm.title.trim()) {
      setError("Training program title is required.");
      return;
    }
    if (!programForm.description.trim()) {
      setError("Detailed description is required.");
      return;
    }

    setSavingProgram(true);
    setError("");
    try {
      const selectedCat = categories.find((c) => c._id === programForm.category);
      const payload = {
        ...programForm,
        categoryName: selectedCat ? selectedCat.name : programForm.categoryName,
        fee: programForm.pricing?.totalFee || "",
      };

      if (editingProgramId) {
        await trainingApi.update(editingProgramId, payload);
        setNotice("Training program updated successfully.");
      } else {
        await trainingApi.create(payload);
        setNotice("Training program created successfully.");
      }

      setProgramModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save program.");
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteProgram = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    try {
      await trainingApi.remove(item._id);
      setNotice(`Deleted “${item.title}”.`);
      setPrograms((prev) => prev.filter((p) => p._id !== item._id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete program.");
    }
  };

  // Repeatable Field Helpers
  const addTechnology = () => {
    const val = newTech.trim();
    if (!val) return;
    if (!programForm.technologies.includes(val)) {
      setProgramForm((prev) => ({ ...prev, technologies: [...prev.technologies, val] }));
    }
    setNewTech("");
  };

  const removeTechnology = (index) => {
    setProgramForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addLearningOutcome = () => {
    const val = newOutcome.trim();
    if (!val) return;
    setProgramForm((prev) => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, val] }));
    setNewOutcome("");
  };

  const removeLearningOutcome = (index) => {
    setProgramForm((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    const val = newProject.trim();
    if (!val) return;
    setProgramForm((prev) => ({ ...prev, projects: [...prev.projects, val] }));
    setNewProject("");
  };

  const removeProject = (index) => {
    setProgramForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    const val = newBenefit.trim();
    if (!val) return;
    setProgramForm((prev) => ({ ...prev, benefits: [...prev.benefits, val] }));
    setNewBenefit("");
  };

  const removeBenefit = (index) => {
    setProgramForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    const q = newFaqQuestion.trim();
    const a = newFaqAnswer.trim();
    if (!q || !a) return;
    setProgramForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: q, answer: a }],
    }));
    setNewFaqQuestion("");
    setNewFaqAnswer("");
  };

  const removeFaq = (index) => {
    setProgramForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Syllabus Section & Topic helpers
  const addSyllabusSection = () => {
    const title = newSectionTitle.trim() || `Module ${programForm.syllabus.length + 1}`;
    setProgramForm((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, { sectionTitle: title, topics: [] }],
    }));
    setNewSectionTitle("");
  };

  const removeSyllabusSection = (sIndex) => {
    setProgramForm((prev) => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== sIndex),
    }));
  };

  const addTopicToSection = (sIndex) => {
    const topicText = (newTopicBySection[sIndex] || "").trim();
    if (!topicText) return;
    setProgramForm((prev) => {
      const updated = [...prev.syllabus];
      updated[sIndex] = {
        ...updated[sIndex],
        topics: [...(updated[sIndex].topics || []), topicText],
      };
      return { ...prev, syllabus: updated };
    });
    setNewTopicBySection((prev) => ({ ...prev, [sIndex]: "" }));
  };

  const removeTopicFromSection = (sIndex, tIndex) => {
    setProgramForm((prev) => {
      const updated = [...prev.syllabus];
      updated[sIndex] = {
        ...updated[sIndex],
        topics: updated[sIndex].topics.filter((_, i) => i !== tIndex),
      };
      return { ...prev, syllabus: updated };
    });
  };

  // Category Handlers
  const openCreateCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm(initialCategoryForm);
    setCategoryModalOpen(true);
    setError("");
    setNotice("");
  };

  const openEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      displayOrder: cat.displayOrder ?? 0,
      isActive: cat.isActive ?? true,
    });
    setCategoryModalOpen(true);
    setError("");
    setNotice("");
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSavingCategory(true);
    setError("");
    try {
      if (editingCategoryId) {
        await trainingApi.updateCategory(editingCategoryId, categoryForm);
        setNotice("Category updated successfully.");
      } else {
        await trainingApi.createCategory(categoryForm);
        setNotice("Category created successfully.");
      }
      setCategoryModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save category.");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category “${cat.name}”? Programs under this category will need reassignment.`)) return;
    try {
      await trainingApi.removeCategory(cat._id);
      setNotice(`Deleted category “${cat.name}”.`);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete category.");
    }
  };

  return (
    <section>
      <header className={adminStyles.pageHeader}>
        <div>
          <p className={adminStyles.eyebrow}>WEBSITE CONTENT</p>
          <h1>Training Management</h1>
          <p>Manage training programs, categories, syllabus curriculum, and pricing.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={adminStyles.secondaryButton} type="button" onClick={openCreateCategory}>
            <Layers size={16} /> New Category
          </button>
          <button className={adminStyles.primaryButton} type="button" onClick={openCreateProgram}>
            <Plus size={17} /> Add Training Program
          </button>
        </div>
      </header>

      {notice && <p className={adminStyles.notice} role="status">{notice}</p>}
      {error && <p className={adminStyles.error} role="alert">{error}</p>}

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        <button
          className={`${styles.tab} ${activeTab === "programs" ? styles.active : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "programs"}
          onClick={() => setActiveTab("programs")}
        >
          Training Programs ({programs.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "categories" ? styles.active : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "categories"}
          onClick={() => setActiveTab("categories")}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === "programs" ? (
        <>
          {/* Programs Toolbar */}
          <div className={adminStyles.toolbar}>
            <div className={styles.filterGroup}>
              <label className={adminStyles.search}>
                <Search size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, category, tech..."
                />
              </label>
              <select
                className={styles.categorySelect}
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <span>{visiblePrograms.length} programs</span>
          </div>

          {/* Programs Table */}
          <div className={adminStyles.tableFrame}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Program Title</th>
                  <th>Category</th>
                  <th>Duration / Mode</th>
                  <th>Pricing</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={adminStyles.empty}>
                      Loading programs...
                    </td>
                  </tr>
                ) : visiblePrograms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={adminStyles.empty}>
                      No training programs found. Click <strong>Add Training Program</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  visiblePrograms.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.thumbnailCell}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className={styles.placeholderThumb}>
                            <GraduationCap size={16} />
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{item.title}</strong>
                        {item.slug && <small style={{ display: "block", color: "#82908b" }}>/{item.slug}</small>}
                      </td>
                      <td>{item.category?.name || item.categoryName || "—"}</td>
                      <td>
                        {item.duration || "—"} · <span style={{ color: "#647575" }}>{item.mode || "Hybrid"}</span>
                      </td>
                      <td>
                        <div className={styles.priceTag}>
                          {item.pricing?.discountedFee && (
                            <span className={styles.discountedPrice}>{item.pricing.discountedFee}</span>
                          )}
                          <span
                            className={item.pricing?.discountedFee ? styles.originalPrice : styles.discountedPrice}
                          >
                            {item.pricing?.totalFee || item.fee || "Free / Enquiry"}
                          </span>
                          <span className={styles.pricingType}>{item.pricing?.pricingType || "Total Fee"}</span>
                        </div>
                      </td>
                      <td>
                        <span className={item.isActive ? adminStyles.stateOn : adminStyles.stateOff}>
                          {item.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className={adminStyles.actions}>
                        <button
                          type="button"
                          aria-label="View program details"
                          title="View Details"
                          onClick={() => setViewingProgram(item)}
                        >
                          <Eye size={15} />
                        </button>
                        <Link
                          to={`/trainings/${item.slug || item._id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Preview public page"
                          className={adminStyles.iconButton}
                          style={{ textDecoration: "none" }}
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          type="button"
                          aria-label="Edit program"
                          title="Edit"
                          onClick={() => openEditProgram(item)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete program"
                          title="Delete"
                          onClick={() => handleDeleteProgram(item)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Categories Table */}
          <div className={adminStyles.toolbar}>
            <span>{categories.length} categories</span>
            <button className={adminStyles.primaryButton} type="button" onClick={openCreateCategory}>
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div className={adminStyles.tableFrame}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={adminStyles.empty}>
                      No categories found. Click <strong>Add Category</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <strong>{cat.name}</strong>
                      </td>
                      <td>
                        <code>{cat.slug}</code>
                      </td>
                      <td>{cat.description || "—"}</td>
                      <td>{cat.displayOrder ?? 0}</td>
                      <td>
                        <span className={cat.isActive ? adminStyles.stateOn : adminStyles.stateOff}>
                          {cat.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className={adminStyles.actions}>
                        <button
                          type="button"
                          aria-label="Edit category"
                          title="Edit"
                          onClick={() => openEditCategory(cat)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete category"
                          title="Delete"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Program Create/Edit Modal */}
      {programModalOpen && (
        <div
          className={adminStyles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeProgramModal();
          }}
        >
          <section className={`${adminStyles.modal} ${styles.modalLarge}`} role="dialog" aria-modal="true">
            <header>
              <div>
                <p className={adminStyles.eyebrow}>
                  {editingProgramId ? "EDIT PROGRAM" : "NEW TRAINING PROGRAM"}
                </p>
                <h2>{editingProgramId ? "Edit" : "Add"} Training Program</h2>
              </div>
              <button
                type="button"
                className={adminStyles.iconButton}
                onClick={closeProgramModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>

            <form onSubmit={handleSaveProgram}>
              {/* Section 1: Basic Information */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>1. Basic Information</h3>
                    <p>Core program identity, category assignment, and banner imagery.</p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={adminStyles.field}>
                    <span>Training Title *</span>
                    <input
                      required
                      value={programForm.title}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. MERN Stack Industrial Training"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Category *</span>
                    <select
                      required
                      value={programForm.category}
                      onChange={(e) => {
                        const catId = e.target.value;
                        const found = categories.find((c) => c._id === catId);
                        setProgramForm((prev) => ({
                          ...prev,
                          category: catId,
                          categoryName: found ? found.name : prev.categoryName,
                        }));
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={adminStyles.field}>
                    <span>Custom Slug (Optional)</span>
                    <input
                      value={programForm.slug}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="Leave blank to auto-generate from title"
                    />
                    <small>URL identifier: /trainings/{programForm.slug || "program-slug"}</small>
                  </label>

                  <label className={adminStyles.field}>
                    <span>Active on Public Site</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <input
                        type="checkbox"
                        checked={programForm.isActive}
                        onChange={(e) =>
                          setProgramForm((prev) => ({ ...prev, isActive: e.target.checked }))
                        }
                      />
                      <span>Visible to students and in navigation</span>
                    </div>
                  </label>

                  <label className={`${adminStyles.field} ${styles.fullWidth}`}>
                    <span>Short Description / Introduction</span>
                    <textarea
                      rows={2}
                      value={programForm.shortDescription}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                      }
                      placeholder="Brief overview shown on course cards and detail page header..."
                    />
                  </label>

                  <label className={`${adminStyles.field} ${styles.fullWidth}`}>
                    <span>Detailed Description (About Training) *</span>
                    <textarea
                      rows={5}
                      required
                      value={programForm.description}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Comprehensive overview of curriculum goals, target audience, and methodology..."
                    />
                  </label>

                  {/* Banner Image Upload */}
                  <label className={`${adminStyles.field} ${styles.fullWidth}`}>
                    <span>Training Thumbnail / Banner Image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        setError("");
                        try {
                          const url = await uploadImage(file);
                          setProgramForm((prev) => ({ ...prev, image: url }));
                        } catch (err) {
                          setError(err.response?.data?.message || "Image upload failed.");
                        } finally {
                          setUploadingImage(false);
                          e.target.value = "";
                        }
                      }}
                    />
                    {uploadingImage && <small>Uploading image to Cloudinary...</small>}
                    {programForm.image && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                        <img
                          src={programForm.image}
                          alt="Thumbnail preview"
                          className={adminStyles.imagePreview}
                        />
                        <button
                          type="button"
                          className={adminStyles.secondaryButton}
                          onClick={() => setProgramForm((prev) => ({ ...prev, image: "" }))}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Section 2: Training Details */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>2. Training Details</h3>
                    <p>Duration, mode, eligibility, batch start schedule, and certification.</p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={adminStyles.field}>
                    <span>Duration</span>
                    <select
                      value={programForm.duration}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, duration: e.target.value }))
                      }
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="Flexible / Custom">Flexible / Custom</option>
                    </select>
                  </label>

                  <label className={adminStyles.field}>
                    <span>Training Mode</span>
                    <select
                      value={programForm.mode}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, mode: e.target.value }))
                      }
                    >
                      <option value="Hybrid">Hybrid (Online + Offline)</option>
                      <option value="Online">Online Live Interactive</option>
                      <option value="Offline">Offline Classroom</option>
                    </select>
                  </label>

                  <label className={adminStyles.field}>
                    <span>Eligibility Criteria</span>
                    <input
                      value={programForm.eligibility}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, eligibility: e.target.value }))
                      }
                      placeholder="e.g. BCA, MCA, B.Tech, or Fresh Graduates"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Batch Details / Start Schedule</span>
                    <input
                      value={programForm.batchDetails}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          batchDetails: e.target.value,
                          batchStartDate: e.target.value,
                        }))
                      }
                      placeholder="e.g. Next Batch: 1st August 2025"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Class Schedule / Timing</span>
                    <input
                      value={programForm.schedule || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, schedule: e.target.value }))
                      }
                      placeholder="e.g. Mon - Fri, 2 Hours/day"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Available Seats / Batch Size</span>
                    <input
                      value={programForm.seats || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({ ...prev, seats: e.target.value }))
                      }
                      placeholder="e.g. 25 Seats per batch"
                    />
                  </label>

                  <label className={`${adminStyles.field} ${styles.fullWidth}`}>
                    <span>Certificate Offer & Details</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0" }}>
                      <input
                        type="checkbox"
                        checked={programForm.certificate?.offered ?? true}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            certificate: { ...prev.certificate, offered: e.target.checked },
                          }))
                        }
                      />
                      <span>Provide Certificate upon course completion</span>
                    </div>
                    <input
                      value={programForm.certificate?.details || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          certificate: { ...prev.certificate, details: e.target.value },
                        }))
                      }
                      placeholder="e.g. Industry-Recognized Certificate & Project Letter"
                    />
                  </label>
                </div>
              </div>

              {/* Section 3: Pricing Information */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>3. Pricing Information</h3>
                    <p>Clearly separate standard fee, optional discount, and pricing type.</p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={adminStyles.field}>
                    <span>Pricing Type</span>
                    <select
                      value={programForm.pricing?.pricingType || "Total Program Fee"}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, pricingType: e.target.value },
                        }))
                      }
                    >
                      <option value="Total Program Fee">Total Program Fee</option>
                      <option value="Monthly Fee">Monthly Fee</option>
                      <option value="One-Time Fee">One-Time Fee</option>
                      <option value="Free / Scholarship">Free / Scholarship</option>
                    </select>
                  </label>

                  <label className={adminStyles.field}>
                    <span>Total Standard Fee</span>
                    <input
                      value={programForm.pricing?.totalFee || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, totalFee: e.target.value },
                        }))
                      }
                      placeholder="e.g. ₹25,000 or 25000"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Discounted / Offer Price (Optional)</span>
                    <input
                      value={programForm.pricing?.discountedFee || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, discountedFee: e.target.value },
                        }))
                      }
                      placeholder="e.g. ₹18,000 (Shown as active offer price)"
                    />
                  </label>
                </div>
              </div>

              {/* Section 4: Technologies & Skills (Repeatable with Add button) */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>4. Technologies & Tools Covered</h3>
                    <p>Add individual frameworks, languages, and tools using the Add button.</p>
                  </div>
                </div>

                <div className={styles.repeatableWrapper}>
                  <div className={styles.addInputRow}>
                    <input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                      placeholder="Type a technology (e.g. React.js, Node.js, MongoDB, Docker)..."
                    />
                    <button type="button" className={styles.addItemButton} onClick={addTechnology}>
                      <Plus size={15} /> Add Technology
                    </button>
                  </div>

                  <div className={styles.itemList}>
                    {programForm.technologies.length === 0 ? (
                      <small style={{ color: "#82908b" }}>No technologies added yet.</small>
                    ) : (
                      programForm.technologies.map((tech, index) => (
                        <div key={index} className={styles.itemRow}>
                          <input
                            value={tech}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProgramForm((prev) => {
                                const list = [...prev.technologies];
                                list[index] = val;
                                return { ...prev, technologies: list };
                              });
                            }}
                          />
                          <button
                            type="button"
                            className={styles.itemRemoveButton}
                            onClick={() => removeTechnology(index)}
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Detailed Syllabus Curriculum (Organized Sections & Topics) */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>5. Syllabus Curriculum</h3>
                    <p>Organize syllabus into modules/sections with individual topics per section.</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      style={{ height: "34px", padding: "0 8px", fontSize: "12px", border: "1px solid #dbe4df" }}
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="New module title..."
                    />
                    <button type="button" className={styles.addItemButton} onClick={addSyllabusSection}>
                      <Plus size={14} /> Add Section
                    </button>
                  </div>
                </div>

                {programForm.syllabus.map((section, sIndex) => (
                  <div key={sIndex} className={styles.syllabusModule}>
                    <div className={styles.moduleTop}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <BookOpen size={16} color="#16806c" />
                        <input
                          value={section.sectionTitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProgramForm((prev) => {
                              const list = [...prev.syllabus];
                              list[sIndex] = { ...list[sIndex], sectionTitle: val };
                              return { ...prev, syllabus: list };
                            });
                          }}
                          placeholder={`Section ${sIndex + 1} Title`}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.itemRemoveButton}
                        onClick={() => removeSyllabusSection(sIndex)}
                        title="Delete entire section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Topics inside this section */}
                    <div style={{ paddingLeft: "16px" }}>
                      <div className={styles.addInputRow} style={{ marginBottom: "8px" }}>
                        <input
                          value={newTopicBySection[sIndex] || ""}
                          onChange={(e) =>
                            setNewTopicBySection((prev) => ({ ...prev, [sIndex]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTopicToSection(sIndex);
                            }
                          }}
                          placeholder="Add topic to this section..."
                        />
                        <button
                          type="button"
                          className={styles.addItemButton}
                          onClick={() => addTopicToSection(sIndex)}
                        >
                          <Plus size={13} /> Add Topic
                        </button>
                      </div>

                      <div className={styles.itemList}>
                        {(section.topics || []).map((topic, tIndex) => (
                          <div key={tIndex} className={styles.itemRow}>
                            <span style={{ fontSize: "11px", color: "#647575", width: "18px" }}>
                              {tIndex + 1}.
                            </span>
                            <input
                              value={topic}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProgramForm((prev) => {
                                  const list = [...prev.syllabus];
                                  const topics = [...list[sIndex].topics];
                                  topics[tIndex] = val;
                                  list[sIndex] = { ...list[sIndex], topics };
                                  return { ...prev, syllabus: list };
                                });
                              }}
                            />
                            <button
                              type="button"
                              className={styles.itemRemoveButton}
                              onClick={() => removeTopicFromSection(sIndex, tIndex)}
                              title="Remove topic"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 6: Practical Projects & Activities */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>6. Practical Projects & Activities</h3>
                    <p>Live industrial capstones and hands-on activities students will build.</p>
                  </div>
                </div>

                <div className={styles.repeatableWrapper}>
                  <div className={styles.addInputRow}>
                    <input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addProject();
                        }
                      }}
                      placeholder="e.g. E-Commerce Platform with Stripe & Razorpay Payments..."
                    />
                    <button type="button" className={styles.addItemButton} onClick={addProject}>
                      <Plus size={15} /> Add Project
                    </button>
                  </div>

                  <div className={styles.itemList}>
                    {programForm.projects.length === 0 ? (
                      <small style={{ color: "#82908b" }}>No projects added yet.</small>
                    ) : (
                      programForm.projects.map((proj, index) => (
                        <div key={index} className={styles.itemRow}>
                          <input
                            value={proj}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProgramForm((prev) => {
                                const list = [...prev.projects];
                                list[index] = val;
                                return { ...prev, projects: list };
                              });
                            }}
                          />
                          <button
                            type="button"
                            className={styles.itemRemoveButton}
                            onClick={() => removeProject(index)}
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Section 7: Learning Outcomes */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>7. Learning Outcomes ("What You Will Learn")</h3>
                    <p>Key competencies and skills students master by the end of this course.</p>
                  </div>
                </div>

                <div className={styles.repeatableWrapper}>
                  <div className={styles.addInputRow}>
                    <input
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLearningOutcome();
                        }
                      }}
                      placeholder="e.g. Architect and deploy secure production REST APIs with Node and Express..."
                    />
                    <button type="button" className={styles.addItemButton} onClick={addLearningOutcome}>
                      <Plus size={15} /> Add Outcome
                    </button>
                  </div>

                  <div className={styles.itemList}>
                    {programForm.learningOutcomes.length === 0 ? (
                      <small style={{ color: "#82908b" }}>No learning outcomes added yet.</small>
                    ) : (
                      programForm.learningOutcomes.map((item, index) => (
                        <div key={index} className={styles.itemRow}>
                          <input
                            value={item}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProgramForm((prev) => {
                                const list = [...prev.learningOutcomes];
                                list[index] = val;
                                return { ...prev, learningOutcomes: list };
                              });
                            }}
                          />
                          <button
                            type="button"
                            className={styles.itemRemoveButton}
                            onClick={() => removeLearningOutcome(index)}
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Section 8: Benefits & Perks */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>8. Key Program Benefits</h3>
                    <p>Bullet highlights featured on sidebar and benefits cards.</p>
                  </div>
                </div>

                <div className={styles.repeatableWrapper}>
                  <div className={styles.addInputRow}>
                    <input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addBenefit();
                        }
                      }}
                      placeholder="e.g. 1-on-1 Mentor Guidance & Mock Interviews..."
                    />
                    <button type="button" className={styles.addItemButton} onClick={addBenefit}>
                      <Plus size={15} /> Add Benefit
                    </button>
                  </div>

                  <div className={styles.itemList}>
                    {programForm.benefits.map((b, index) => (
                      <div key={index} className={styles.itemRow}>
                        <input
                          value={b}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProgramForm((prev) => {
                              const list = [...prev.benefits];
                              list[index] = val;
                              return { ...prev, benefits: list };
                            });
                          }}
                        />
                        <button
                          type="button"
                          className={styles.itemRemoveButton}
                          onClick={() => removeBenefit(index)}
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 9: FAQs */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>9. Frequently Asked Questions (FAQs)</h3>
                    <p>Address common student questions regarding batch timings, prerequisites, or fees.</p>
                  </div>
                </div>

                <div className={styles.repeatableWrapper}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
                    <input
                      className={styles.addInputRow}
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      placeholder="Question: e.g. Do I need prior coding knowledge to enroll?"
                    />
                    <textarea
                      rows={2}
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      placeholder="Answer: e.g. No prior experience is required; we start from programming basics..."
                    />
                    <button
                      type="button"
                      className={styles.addItemButton}
                      style={{ alignSelf: "flex-start" }}
                      onClick={addFaq}
                    >
                      <Plus size={14} /> Add FAQ Item
                    </button>
                  </div>

                  <div className={styles.itemList}>
                    {programForm.faqs.map((faq, index) => (
                      <div key={index} className={styles.faqItemRow}>
                        <div className={styles.faqHeader}>
                          <span>FAQ #{index + 1}</span>
                          <button
                            type="button"
                            className={styles.itemRemoveButton}
                            onClick={() => removeFaq(index)}
                            title="Remove FAQ"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <input
                          value={faq.question}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProgramForm((prev) => {
                              const list = [...prev.faqs];
                              list[index] = { ...list[index], question: val };
                              return { ...prev, faqs: list };
                            });
                          }}
                          placeholder="Question"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProgramForm((prev) => {
                              const list = [...prev.faqs];
                              list[index] = { ...list[index], answer: val };
                              return { ...prev, faqs: list };
                            });
                          }}
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 10: Contact & Admissions Details */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3>10. Program Contact & Admissions Details (Optional)</h3>
                    <p>Program-specific contact info or leave blank to use company defaults.</p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={adminStyles.field}>
                    <span>Admissions Phone Number</span>
                    <input
                      value={programForm.contactDetails?.phone || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          contactDetails: { ...prev.contactDetails, phone: e.target.value },
                        }))
                      }
                      placeholder="e.g. 9302039953"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>Admissions Email</span>
                    <input
                      value={programForm.contactDetails?.email || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          contactDetails: { ...prev.contactDetails, email: e.target.value },
                        }))
                      }
                      placeholder="e.g. techzen@gmail.com"
                    />
                  </label>

                  <label className={adminStyles.field}>
                    <span>WhatsApp Number</span>
                    <input
                      value={programForm.contactDetails?.whatsapp || ""}
                      onChange={(e) =>
                        setProgramForm((prev) => ({
                          ...prev,
                          contactDetails: { ...prev.contactDetails, whatsapp: e.target.value },
                        }))
                      }
                      placeholder="e.g. 9302039953"
                    />
                  </label>
                </div>
              </div>

              <footer>
                <button type="button" className={adminStyles.secondaryButton} onClick={closeProgramModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={adminStyles.primaryButton}
                  disabled={savingProgram || uploadingImage}
                >
                  {savingProgram ? "Saving..." : editingProgramId ? "Update Program" : "Create Program"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {categoryModalOpen && (
        <div
          className={adminStyles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCategoryModal();
          }}
        >
          <section className={adminStyles.modal} role="dialog" aria-modal="true">
            <header>
              <div>
                <p className={adminStyles.eyebrow}>
                  {editingCategoryId ? "EDIT CATEGORY" : "NEW CATEGORY"}
                </p>
                <h2>{editingCategoryId ? "Edit" : "Add"} Training Category</h2>
              </div>
              <button
                type="button"
                className={adminStyles.iconButton}
                onClick={closeCategoryModal}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>

            <form onSubmit={handleSaveCategory}>
              <div className={adminStyles.formGrid}>
                <label className={adminStyles.field}>
                  <span>Category Name *</span>
                  <input
                    required
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Industrial Training, Internship Training"
                  />
                </label>

                <label className={adminStyles.field}>
                  <span>Slug (Optional)</span>
                  <input
                    value={categoryForm.slug}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="Leave blank to auto-generate"
                  />
                </label>

                <label className={`${adminStyles.field} ${adminStyles.fullWidth}`}>
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief description of this training category..."
                  />
                </label>

                <label className={adminStyles.field}>
                  <span>Display Order</span>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        displayOrder: Number(e.target.value || 0),
                      }))
                    }
                  />
                </label>

                <label className={`${adminStyles.field} ${adminStyles.checkField}`}>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  <span>Active & Visible in Navbar</span>
                </label>
              </div>

              <footer>
                <button type="button" className={adminStyles.secondaryButton} onClick={closeCategoryModal}>
                  Cancel
                </button>
                <button type="submit" className={adminStyles.primaryButton} disabled={savingCategory}>
                  {savingCategory ? "Saving..." : "Save Category"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* View Program Modal */}
      {viewingProgram && (
        <div
          className={adminStyles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewingProgram(null);
          }}
        >
          <section
            className={`${adminStyles.modal} ${styles.modalLarge}`}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "860px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <header>
              <div>
                <p className={adminStyles.eyebrow}>
                  {viewingProgram.categoryName || viewingProgram.category?.name || "PROGRAM DETAILS"}
                </p>
                <h2>{viewingProgram.title}</h2>
              </div>
              <button
                type="button"
                className={adminStyles.iconButton}
                onClick={() => setViewingProgram(null)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>

            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Quick Summary Strip */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                  background: "#f8fafc",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span>
                  <strong>Slug:</strong> /{viewingProgram.slug}
                </span>
                <span>•</span>
                <span>
                  <strong>Duration:</strong> {viewingProgram.duration || "—"}
                </span>
                <span>•</span>
                <span>
                  <strong>Mode:</strong> {viewingProgram.mode || "—"}
                </span>
                <span>•</span>
                <span>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      viewingProgram.isActive ? adminStyles.stateOn : adminStyles.stateOff
                    }
                  >
                    {viewingProgram.isActive ? "Active" : "Hidden"}
                  </span>
                </span>
              </div>

              {/* Pricing & Schedule */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <h4 style={{ margin: "0 0 6px", color: "#166534" }}>Pricing Structure</h4>
                  <div>
                    <strong>Standard Fee:</strong>{" "}
                    {viewingProgram.pricing?.totalFee || viewingProgram.fee || "—"}
                  </div>
                  {viewingProgram.pricing?.discountedFee && (
                    <div>
                      <strong>Discounted Offer:</strong> {viewingProgram.pricing.discountedFee}
                    </div>
                  )}
                  <small style={{ color: "#4b5563" }}>
                    Type: {viewingProgram.pricing?.pricingType || "Total Fee"}
                  </small>
                </div>

                <div
                  style={{
                    background: "#eff6ff",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <h4 style={{ margin: "0 0 6px", color: "#1e40af" }}>Schedule & Batches</h4>
                  <div>
                    <strong>Batch:</strong> {viewingProgram.batchDetails || "—"}
                  </div>
                  <div>
                    <strong>Schedule:</strong> {viewingProgram.schedule || "—"}
                  </div>
                  <div>
                    <strong>Seats:</strong> {viewingProgram.seats || "—"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ margin: "0 0 6px" }}>Overview / Description</h4>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {viewingProgram.description || viewingProgram.shortDescription || "No description provided."}
                </p>
              </div>

              {/* Technologies */}
              {Array.isArray(viewingProgram.technologies) && viewingProgram.technologies.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>
                    Technologies Covered ({viewingProgram.technologies.length})
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {viewingProgram.technologies.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus Summary */}
              {Array.isArray(viewingProgram.syllabus) && viewingProgram.syllabus.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>
                    Syllabus Curriculum ({viewingProgram.syllabus.length} Modules)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {viewingProgram.syllabus.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#f8fafc",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <strong>{s.sectionTitle || `Module ${idx + 1}`}</strong>
                        {Array.isArray(s.topics) && s.topics.length > 0 && (
                          <ul
                            style={{
                              margin: "6px 0 0",
                              paddingLeft: "20px",
                              fontSize: "13px",
                              color: "#64748b",
                            }}
                          >
                            {s.topics.map((t, ti) => (
                              <li key={ti}>{t}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {Array.isArray(viewingProgram.projects) && viewingProgram.projects.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>
                    Practical Capstone Projects ({viewingProgram.projects.length})
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569" }}>
                    {viewingProgram.projects.map((p, i) => (
                      <li key={i}>{typeof p === "string" ? p : p.title}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {Array.isArray(viewingProgram.benefits) && viewingProgram.benefits.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>Key Benefits ({viewingProgram.benefits.length})</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569" }}>
                    {viewingProgram.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQs */}
              {Array.isArray(viewingProgram.faqs) && viewingProgram.faqs.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 8px" }}>FAQs ({viewingProgram.faqs.length})</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {viewingProgram.faqs.map((f, i) => (
                      <div key={i} style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "6px" }}>
                        <strong style={{ fontSize: "13px" }}>Q: {f.question}</strong>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>
                          A: {f.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {(viewingProgram.contactDetails?.phone ||
                viewingProgram.contactDetails?.email ||
                viewingProgram.contactDetails?.whatsapp) && (
                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "6px" }}>
                  <h4 style={{ margin: "0 0 6px" }}>Program Contact Info</h4>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    {viewingProgram.contactDetails.phone && (
                      <div>Phone: {viewingProgram.contactDetails.phone}</div>
                    )}
                    {viewingProgram.contactDetails.email && (
                      <div>Email: {viewingProgram.contactDetails.email}</div>
                    )}
                    {viewingProgram.contactDetails.whatsapp && (
                      <div>WhatsApp: {viewingProgram.contactDetails.whatsapp}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <footer>
              <button
                type="button"
                className={adminStyles.secondaryButton}
                onClick={() => setViewingProgram(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={adminStyles.primaryButton}
                onClick={() => {
                  const toEdit = viewingProgram;
                  setViewingProgram(null);
                  openEditProgram(toEdit);
                }}
              >
                <Pencil size={15} /> Edit This Program
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

