import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  Calendar,
  Award,
  Users,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  X,
  Code2,
  FolderGit2,
  BookOpen,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { trainingApi } from "../../Api/CmsApi";
import api from "../../Api/ApiIntersceptor";
import { Tranings as fallbackTrainings, company } from "../../data/siteData";
import styles from "./TrainingDetail.module.css";

export default function TrainingDetail() {
  const { slug } = useParams();

  // Find fallback match first
  const fallbackMatch = useMemo(() => {
    return (
      (fallbackTrainings || []).find(
        (t) =>
          t.slug === slug ||
          t._id === slug ||
          t.id === slug ||
          t.slug?.toLowerCase() === slug?.toLowerCase()
      ) || null
    );
  }, [slug]);

  const [training, setTraining] = useState(() => fallbackMatch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Accordion state for syllabus modules (first 2 open by default)
  const [openModules, setOpenModules] = useState({ 0: true, 1: true });
  // Accordion state for FAQs (first open by default)
  const [openFaqs, setOpenFaqs] = useState({ 0: true });

  // Enquiry modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    mode: "Hybrid",
    contactMethod: "Email",
    message: "",
  });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    trainingApi
      .getBySlugOrId(slug)
      .then((data) => {
        if (!active) return;
        if (data) {
          setTraining(data);
        } else if (fallbackMatch) {
          setTraining(fallbackMatch);
        } else {
          setError("Training program not found.");
        }
      })
      .catch((err) => {
        if (!active) return;
        if (fallbackMatch) {
          setTraining(fallbackMatch);
        } else {
          setError(
            err.response?.data?.message || "Unable to load training program."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, fallbackMatch]);

  // Scroll to top on page load / slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const toggleModule = (index) => {
    setOpenModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAllModules = () => {
    const syllabusLen = training?.syllabus?.length || 0;
    const allOpen = Object.values(openModules).filter(Boolean).length === syllabusLen;
    if (allOpen) {
      setOpenModules({});
    } else {
      const next = {};
      for (let i = 0; i < syllabusLen; i++) next[i] = true;
      setOpenModules(next);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setEnquirySuccess(false);
    setEnquiryError("");
    setEnquiryForm({
      name: "",
      email: "",
      phone: "",
      mode: training?.mode || "Hybrid",
      contactMethod: "Email",
      message: `Hi TechZen, I would like to enquire about the ${training?.title || "training"} program.`,
    });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryError("");

    if (!enquiryForm.name.trim()) {
      setEnquiryError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email.trim())) {
      setEnquiryError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(enquiryForm.phone.replace(/[\s+-]/g, ""))) {
      setEnquiryError("Phone number must contain exactly 10 digits.");
      return;
    }
    if (enquiryForm.message.trim().length < 10) {
      setEnquiryError("Please provide a message with at least 10 characters.");
      return;
    }

    setSubmittingEnquiry(true);
    try {
      const payload = {
        name: enquiryForm.name.trim(),
        email: enquiryForm.email.trim(),
        phone: enquiryForm.phone.replace(/[\s+-]/g, ""),
        service: `Training: ${training?.title || "General"}`,
        contactMethod: enquiryForm.contactMethod || "Email",
        message: `${enquiryForm.message.trim()} (Preferred Mode: ${enquiryForm.mode})`,
        consent: true,
      };

      await api.post("/v1/inquiry/register", payload);
      setEnquirySuccess(true);
    } catch (err) {
      setEnquiryError(
        err.response?.data?.message || "Failed to submit enquiry. Please try again or call us."
      );
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  if (loading && !training) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#f1f5f9" }}>
              Loading Training Program...
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Fetching latest curriculum and schedule details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!training && !loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.notFoundContainer}>
            <GraduationCap size={64} color="#60a5fa" style={{ marginBottom: "16px" }} />
            <h1 className={styles.notFoundTitle}>Training Program Not Found</h1>
            <p className={styles.notFoundText}>
              The program you requested does not exist or may currently be inactive. Please explore our available courses.
            </p>
            <Link to="/#trainings" className={styles.backHomeBtn}>
              <ArrowLeft size={16} /> Explore All Training Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculated pricing display
  const totalFee = training.pricing?.totalFee || training.fee || "Contact for Fee";
  const discountedFee = training.pricing?.discountedFee || "";
  const pricingType = training.pricing?.pricingType || "Total Program Fee";

  // Calculate discount percentage if both are numbers
  let discountPercent = null;
  if (totalFee && discountedFee) {
    const numTotal = parseInt(totalFee.replace(/[^\d]/g, ""), 10);
    const numDisc = parseInt(discountedFee.replace(/[^\d]/g, ""), 10);
    if (!isNaN(numTotal) && !isNaN(numDisc) && numTotal > numDisc) {
      discountPercent = Math.round(((numTotal - numDisc) / numTotal) * 100);
    }
  }

  const categoryTitle =
    (typeof training.category === "object" ? training.category?.name : training.category) ||
    training.categoryName ||
    "Professional Training";

  const bannerImg =
    training.image ||
    "https://res.cloudinary.com/djvhmzqwj/image/upload/v1791958200/techZen/rqlcylj3c2qtlqrat6aa.webp";

  const syllabusSections = Array.isArray(training.syllabus) ? training.syllabus : [];
  const technologies = Array.isArray(training.technologies) ? training.technologies : [];
  const projectsList = Array.isArray(training.projects)
    ? training.projects
    : typeof training.projects === "string" && training.projects.trim()
    ? [training.projects.trim()]
    : [];
  const outcomes =
    Array.isArray(training.learningOutcomes) && training.learningOutcomes.length > 0
      ? training.learningOutcomes
      : Array.isArray(training.whatStudentsWillLearn)
      ? training.whatStudentsWillLearn
      : [];
  const benefitsList = Array.isArray(training.benefits) && training.benefits.length > 0
    ? training.benefits
    : Array.isArray(training.features)
    ? training.features
    : [];
  const faqsList = Array.isArray(training.faqs) ? training.faqs : [];

  const contactPhone = training.contactDetails?.phone || company.phone || "9302039953";
  const contactEmail = training.contactDetails?.email || company.email || "techzen@gmail.com";
  const contactWhatsapp = training.contactDetails?.whatsapp || contactPhone;

  const whatsappUrl = `https://wa.me/${contactWhatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    `Hello TechZen, I am interested in enrolling in the ${training.title} program. Could you share batch details?`
  )}`;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/#trainings" className={styles.breadcrumbLink}>
            Trainings
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbLink}>{categoryTitle}</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{training.title}</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.heroSection}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>
              <GraduationCap size={14} />
              {categoryTitle}
            </span>
            <span className={styles.statusPill}>
              <span className={styles.pulseDot} />
              {training.batchDetails || "Enrollment Open"}
            </span>
          </div>

          <h1 className={styles.programTitle}>{training.title}</h1>

          {training.shortDescription && (
            <p className={styles.programIntro}>{training.shortDescription}</p>
          )}

          {/* Quick Info Highlight Bar */}
          <div className={styles.highlightsBar}>
            {training.duration && (
              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <Clock size={20} />
                </div>
                <div className={styles.highlightText}>
                  <span className={styles.highlightLabel}>Duration</span>
                  <span className={styles.highlightValue}>{training.duration}</span>
                </div>
              </div>
            )}

            {training.mode && (
              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <MapPin size={20} />
                </div>
                <div className={styles.highlightText}>
                  <span className={styles.highlightLabel}>Training Mode</span>
                  <span className={styles.highlightValue}>{training.mode}</span>
                </div>
              </div>
            )}

            {training.schedule && (
              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <Calendar size={20} />
                </div>
                <div className={styles.highlightText}>
                  <span className={styles.highlightLabel}>Schedule</span>
                  <span className={styles.highlightValue}>{training.schedule}</span>
                </div>
              </div>
            )}

            {training.eligibility && (
              <div className={styles.highlightItem}>
                <div className={styles.highlightIcon}>
                  <Users size={20} />
                </div>
                <div className={styles.highlightText}>
                  <span className={styles.highlightLabel}>Eligibility</span>
                  <span className={styles.highlightValue}>{training.eligibility}</span>
                </div>
              </div>
            )}

            <div className={styles.highlightItem}>
              <div className={styles.highlightIcon}>
                <Award size={20} />
              </div>
              <div className={styles.highlightText}>
                <span className={styles.highlightLabel}>Certification</span>
                <span className={styles.highlightValue}>Industry Verified</span>
              </div>
            </div>
          </div>

          {/* Banner Visual */}
          {bannerImg && (
            <div className={styles.bannerContainer}>
              <img
                src={bannerImg}
                alt={training.title}
                className={styles.bannerImage}
              />
              <div className={styles.bannerOverlay}>
                <div className={styles.bannerCaption}>
                  <Sparkles size={18} color="#60a5fa" />
                  <span>
                    Practical hands-on training with production capstone projects and mentor code reviews.
                  </span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Two-Column Layout */}
        <div className={styles.mainLayout}>
          {/* Main Content Column */}
          <main className={styles.contentCol}>
            {/* 1. Program Overview */}
            <section className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <BookOpen size={22} /> Program Overview
                </h2>
              </div>
              <div className={styles.richText}>
                {training.description || training.shortDescription}
              </div>
            </section>

            {/* 2. Technologies & Tools Covered */}
            {technologies.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Code2 size={22} /> Technologies & Tools Covered
                  </h2>
                </div>
                <div className={styles.techGrid}>
                  {technologies.map((tech, idx) => (
                    <div key={idx} className={styles.techCard}>
                      <span className={styles.techDot} />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Structured Curriculum & Syllabus */}
            {syllabusSections.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <BookOpen size={22} /> Structured Syllabus & Curriculum
                  </h2>
                  <div className={styles.syllabusControls}>
                    <button
                      type="button"
                      className={styles.toggleAllBtn}
                      onClick={toggleAllModules}
                    >
                      {Object.values(openModules).filter(Boolean).length === syllabusSections.length
                        ? "Collapse All"
                        : "Expand All"}
                    </button>
                  </div>
                </div>

                <div className={styles.syllabusList}>
                  {syllabusSections.map((section, sIndex) => {
                    const isOpen = Boolean(openModules[sIndex]);
                    const topics = Array.isArray(section.topics) ? section.topics : [];

                    return (
                      <div
                        key={sIndex}
                        className={`${styles.moduleCard} ${isOpen ? styles.moduleCardActive : ""}`}
                      >
                        <button
                          type="button"
                          className={styles.moduleHeader}
                          onClick={() => toggleModule(sIndex)}
                          aria-expanded={isOpen}
                        >
                          <div className={styles.moduleLeft}>
                            <span className={styles.moduleIndexBadge}>
                              {sIndex + 1}
                            </span>
                            <span>{section.sectionTitle || `Module ${sIndex + 1}`}</span>
                            <span className={styles.topicCountBadge}>
                              ({topics.length} {topics.length === 1 ? "Topic" : "Topics"})
                            </span>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`${styles.moduleIcon} ${isOpen ? styles.moduleIconOpen : ""}`}
                          />
                        </button>

                        {isOpen && (
                          <div className={styles.moduleBody}>
                            <ul className={styles.topicList}>
                              {topics.map((topic, tIndex) => (
                                <li key={tIndex} className={styles.topicItem}>
                                  <span className={styles.topicBullet} />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. Practical Projects & Activities */}
            {projectsList.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <FolderGit2 size={22} /> Hands-on Capstone Projects
                  </h2>
                </div>
                <div className={styles.projectsGrid}>
                  {projectsList.map((project, pIdx) => (
                    <div key={pIdx} className={styles.projectCard}>
                      <div className={styles.projectIconBox}>
                        <FolderGit2 size={20} />
                      </div>
                      <div className={styles.projectDetails}>
                        <h3 className={styles.projectTitle}>
                          {typeof project === "string" ? project : project.title || "Project"}
                        </h3>
                        {typeof project === "object" && project.description && (
                          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0" }}>
                            {project.description}
                          </p>
                        )}
                        <span className={styles.projectTag}>
                          Industry Capstone #{pIdx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Key Learning Outcomes */}
            {outcomes.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <CheckCircle2 size={22} /> What You Will Learn
                  </h2>
                </div>
                <div className={styles.outcomesGrid}>
                  {outcomes.map((outcome, oIdx) => (
                    <div key={oIdx} className={styles.outcomeCard}>
                      <CheckCircle2 size={18} className={styles.checkIcon} />
                      <span className={styles.outcomeText}>{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Program Benefits & Perks */}
            {benefitsList.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <Sparkles size={22} /> Key Program Benefits
                  </h2>
                </div>
                <div className={styles.benefitsGrid}>
                  {benefitsList.map((benefit, bIdx) => (
                    <div key={bIdx} className={styles.benefitCard}>
                      <div className={styles.benefitIconBox}>
                        <CheckCircle2 size={18} />
                      </div>
                      <span className={styles.benefitText}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Certification Showcase */}
            <section className={styles.contentSection}>
              <div className={styles.certificateCard}>
                <div className={styles.certBadgeBox}>
                  <Award size={32} />
                </div>
                <div className={styles.certContent}>
                  <h3 className={styles.certHeading}>
                    Official TechZen Certification of Completion
                  </h3>
                  <p className={styles.certDesc}>
                    {training.certificate?.details ||
                      "Earn an industry-recognized certificate along with a verified project experience letter to strengthen your resume and portfolio."}
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Frequently Asked Questions */}
            {faqsList.length > 0 && (
              <section className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <HelpCircle size={22} /> Frequently Asked Questions
                  </h2>
                </div>
                <div className={styles.faqList}>
                  {faqsList.map((faq, fIdx) => {
                    const isOpen = Boolean(openFaqs[fIdx]);
                    return (
                      <div
                        key={fIdx}
                        className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                      >
                        <button
                          type="button"
                          className={styles.faqQuestionBtn}
                          onClick={() => toggleFaq(fIdx)}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className={isOpen ? styles.faqArrowOpen : ""}
                          />
                        </button>
                        {isOpen && (
                          <div className={styles.faqAnswerBox}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          {/* Right Sticky Sidebar */}
          <aside className={styles.sidebarSticky}>
            <div className={styles.sidebarCard}>
              <div className={styles.pricingHeader}>
                <span className={styles.cohortTag}>Next Batch Admissions</span>
                {discountPercent && (
                  <span className={styles.discountBadge}>Save {discountPercent}%</span>
                )}
              </div>

              {/* Price Row */}
              <div className={styles.priceBox}>
                <div className={styles.priceRow}>
                  <span className={styles.activePrice}>
                    {discountedFee || totalFee}
                  </span>
                  {discountedFee && (
                    <span className={styles.originalPrice}>{totalFee}</span>
                  )}
                </div>
                <div className={styles.pricingTypeLabel}>{pricingType}</div>
              </div>

              {/* Sidebar Specifications */}
              <div className={styles.sidebarSpecs}>
                <div className={styles.specRow}>
                  <span className={styles.specName}>
                    <Calendar size={14} /> Batch Start
                  </span>
                  <span className={styles.specVal}>
                    {training.batchStartDate || training.batchDetails || "Upcoming"}
                  </span>
                </div>

                <div className={styles.specRow}>
                  <span className={styles.specName}>
                    <Clock size={14} /> Duration
                  </span>
                  <span className={styles.specVal}>{training.duration || "3 Months"}</span>
                </div>

                <div className={styles.specRow}>
                  <span className={styles.specName}>
                    <MapPin size={14} /> Mode
                  </span>
                  <span className={styles.specVal}>{training.mode || "Hybrid"}</span>
                </div>

                {training.schedule && (
                  <div className={styles.specRow}>
                    <span className={styles.specName}>
                      <Calendar size={14} /> Schedule
                    </span>
                    <span className={styles.specVal}>{training.schedule}</span>
                  </div>
                )}

                {training.seats && (
                  <div className={styles.specRow}>
                    <span className={styles.specName}>
                      <Users size={14} /> Seats
                    </span>
                    <span className={styles.specVal}>{training.seats}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={styles.ctaButtonGroup}>
                <button
                  type="button"
                  className={styles.primaryCta}
                  onClick={handleOpenModal}
                >
                  <span>Enquire Now</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappCta}
                >
                  <MessageCircle size={17} />
                  <span>Enroll via WhatsApp</span>
                </a>

                <a href={`tel:${contactPhone}`} className={styles.phoneCta}>
                  <Phone size={15} />
                  <span>Call Admissions: {contactPhone}</span>
                </a>
              </div>

              {/* Included Perks Checklist */}
              <div className={styles.perksList}>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={16} className={styles.perkCheck} />
                  <span>Live 1-on-1 Mentorship & Code Reviews</span>
                </div>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={16} className={styles.perkCheck} />
                  <span>Industry Capstones for Portfolio</span>
                </div>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={16} className={styles.perkCheck} />
                  <span>Certificate & Experience Letter</span>
                </div>
                <div className={styles.perkItem}>
                  <CheckCircle2 size={16} className={styles.perkCheck} />
                  <span>Resume & Mock Interview Coaching</span>
                </div>
              </div>

              {/* Admissions Contact Info */}
              <div className={styles.supportCard}>
                <h4 className={styles.supportTitle}>Questions? Talk with our Admissions</h4>
                <a href={`tel:${contactPhone}`} className={styles.supportRow}>
                  <Phone size={14} color="#60a5fa" />
                  <span>+91 {contactPhone}</span>
                </a>
                <a href={`mailto:${contactEmail}`} className={styles.supportRow}>
                  <Mail size={14} color="#60a5fa" />
                  <span>{contactEmail}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Enquiry Modal */}
      {modalOpen && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className={styles.modalWindow} role="dialog" aria-modal="true">
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <p className={styles.modalEyebrow}>ADMISSIONS DESK</p>
            <h3 className={styles.modalTitle}>Enquire for {training.title}</h3>
            <p className={styles.modalSubtitle}>
              Fill in your details below and our training coordinator will contact you with batch timings, fee structures, and curriculum documents.
            </p>

            {enquirySuccess ? (
              <div className={`${styles.alertBox} ${styles.alertSuccess}`}>
                <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "700" }}>
                  Enquiry Submitted Successfully!
                </h4>
                <p style={{ margin: "0 0 14px", fontSize: "13px" }}>
                  Thank you for your interest! Our team will reach out to you within 24 hours at <strong>{enquiryForm.email}</strong> or <strong>{enquiryForm.phone}</strong>.
                </p>
                <button
                  type="button"
                  className={styles.modalSubmitBtn}
                  onClick={() => setModalOpen(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit}>
                {enquiryError && (
                  <div className={`${styles.alertBox} ${styles.alertError}`}>
                    {enquiryError}
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Full Name *</label>
                    <input
                      required
                      className={styles.fieldInput}
                      value={enquiryForm.name}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Email Address *</label>
                    <input
                      type="email"
                      required
                      className={styles.fieldInput}
                      value={enquiryForm.email}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="e.g. john@example.com"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>10-Digit Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      className={styles.fieldInput}
                      value={enquiryForm.phone}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Preferred Mode</label>
                    <select
                      className={styles.fieldSelect}
                      value={enquiryForm.mode}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({ ...prev, mode: e.target.value }))
                      }
                    >
                      <option value="Hybrid">Hybrid (Online + Physical Lab)</option>
                      <option value="Online">Online Live Interactive</option>
                      <option value="Offline">Offline Classroom</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Preferred Contact Method</label>
                    <select
                      className={styles.fieldSelect}
                      value={enquiryForm.contactMethod}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({
                          ...prev,
                          contactMethod: e.target.value,
                        }))
                      }
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Queries / Message *</label>
                    <textarea
                      rows={3}
                      required
                      className={styles.fieldTextarea}
                      value={enquiryForm.message}
                      onChange={(e) =>
                        setEnquiryForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Ask about batch timings, syllabus, prerequisites..."
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.modalSubmitBtn}
                    disabled={submittingEnquiry}
                  >
                    {submittingEnquiry ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
