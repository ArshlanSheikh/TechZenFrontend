import { useEffect, useState, useRef } from "react";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  BriefcaseBusiness,
  MessagesSquare,
  House,
  UsersRound,
  GraduationCap,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company } from "../../data/siteData";
import styles from "./Navbar.module.css";
import usePublicContent from "../../hooks/usePublicContent";
import useCompanyContent from "../../hooks/useCompanyContent";
import useGroupedTrainings from "../../hooks/useGroupedTrainings";

export default function Navbar() {
  const { items: projects } = usePublicContent("projects");
  const { items: services } = usePublicContent("services");
  const { categories: groupedTrainings } = useGroupedTrainings();
  const { company: companyInfo } = useCompanyContent();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileTrainingsOpen, setMobileTrainingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setMobileProjectsOpen(false);
    setMobileServicesOpen(false);
    setMobileTrainingsOpen(false);
  };

  const handleHashClick = (href, e) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (location.pathname === "/" || location.pathname === "") {
        const el = document.getElementById(targetId);
        if (el) {
          e?.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  const homeLinks = [
    ["Home", "/#home"],
    ["About", "/#about"],
    ["Why Us", "/#why-us"],
    ["Process", "/#process"],
    ["FAQ", "/#faq"],
  ];

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <div className={styles.navWrap}>
            {/* BRAND LOGO */}
            <Link
              to="/"
              className={styles.brand}
              onClick={closeMenu}
              aria-label={`${company.name} Home`}
            >
              <img className={styles.logo} src="/TechZenLogo.png" alt="TechZen" />
            </Link>

            {/* DESKTOP NAV */}
            <nav className={styles.desktopNav} aria-label="Primary navigation">
              {homeLinks.slice(0, 2).map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  onClick={(e) => handleHashClick(href, e)}
                >
                  {label}
                </Link>
              ))}

              <NavbarDropdown
                title="Services"
                items={services}
                viewAllLink="/#services"
                handleHashClick={handleHashClick}
              />

              <NavbarDropdown
                title="Products"
                items={projects}
                viewAllLink="/#projects"
                handleHashClick={handleHashClick}
              />

              {/* DYNAMIC TWO-LEVEL TRAINING DROPDOWN */}
              <TrainingNavbarDropdown
                categories={groupedTrainings}
                handleHashClick={handleHashClick}
              />

              <Link
                to="/#faq"
                onClick={(e) => handleHashClick("/#faq", e)}
              >
                FAQ
              </Link>

              {/* CTA */}
              <Link
                className={styles.navCta}
                to="/#contact"
                onClick={(e) => handleHashClick("/#contact", e)}
              >
                Book a Consultation
                <ArrowRight size={16} />
              </Link>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ""}`}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobileNav"
              aria-label={open ? "Close navigation" : "Open navigation"}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <aside
        id="mobileNav"
        className={`${styles.mobileSidebar} ${open ? styles.sidebarOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.sidebarInner}>
          <nav className={styles.mobileNav}>
            {/* HOME */}
            <Link
              to="/#home"
              onClick={(e) => {
                closeMenu();
                handleHashClick("/#home", e);
              }}
            >
              <House size={18} />
              <span>Home</span>
            </Link>

            {/* ABOUT */}
            <Link
              to="/#about"
              onClick={(e) => {
                closeMenu();
                handleHashClick("/#about", e);
              }}
            >
              <UsersRound size={18} />
              <span>About</span>
            </Link>

            {/* SERVICES DROPDOWN */}
            <NavbarDropdownMobileView
              title="Services"
              items={services}
              isOpen={mobileServicesOpen}
              onToggle={() => setMobileServicesOpen(!mobileServicesOpen)}
              icon={BriefcaseBusiness}
              closeMenu={closeMenu}
              handleHashClick={handleHashClick}
            />

            {/* PRODUCTS DROPDOWN */}
            <NavbarDropdownMobileView
              title="Products"
              items={projects}
              isOpen={mobileProjectsOpen}
              onToggle={() => setMobileProjectsOpen(!mobileProjectsOpen)}
              icon={BriefcaseBusiness}
              closeMenu={closeMenu}
              handleHashClick={handleHashClick}
            />

            {/* TWO-LEVEL TRAINING DROPDOWN ON MOBILE */}
            <TrainingNavbarDropdownMobileView
              categories={groupedTrainings}
              isOpen={mobileTrainingsOpen}
              onToggle={() => setMobileTrainingsOpen(!mobileTrainingsOpen)}
              icon={GraduationCap}
              closeMenu={closeMenu}
              handleHashClick={handleHashClick}
            />

            {/* FAQ */}
            <Link
              to="/#faq"
              onClick={(e) => {
                closeMenu();
                handleHashClick("/#faq", e);
              }}
            >
              <MessagesSquare size={18} />
              <span>FAQ</span>
            </Link>

            {/* CTA */}
            <Link
              className={styles.mobileCta}
              to="/#contact"
              onClick={(e) => {
                closeMenu();
                handleHashClick("/#contact", e);
              }}
            >
              Book a Consultation
              <ArrowRight size={17} />
            </Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <span>© {new Date().getFullYear()}</span>
            <span>{companyInfo.name || company.name}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

// =========================================================================
// DESKTOP TWO-LEVEL TRAINING DROPDOWN
// =========================================================================

function TrainingNavbarDropdown({ categories, handleHashClick }) {
  const [open, setOpen] = useState(false);
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategory = categories[selectedCatIndex] || categories[0];
  const activePrograms = activeCategory?.trainings || [];

  return (
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.dropdownTrigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>Training</span>
        <ChevronDown size={15} />
      </button>

      <div
        className={`${styles.dropdownMenu} ${styles.twoLevelMenu} ${
          open ? styles.dropdownMenuVisible : ""
        }`}
      >
        <div className={styles.megaContainer}>
          {/* Level 1: Categories */}
          <div className={styles.categoryCol}>
            <div className={styles.menuHeading}>CATEGORIES</div>
            {categories.map((cat, index) => {
              const count = cat.trainings?.length || 0;
              const isSelected = index === selectedCatIndex;
              return (
                <button
                  key={cat._id || cat.slug || index}
                  type="button"
                  className={`${styles.categoryItem} ${
                    isSelected ? styles.categoryItemActive : ""
                  }`}
                  onMouseEnter={() => setSelectedCatIndex(index)}
                  onClick={() => setSelectedCatIndex(index)}
                >
                  <span>{cat.name}</span>
                  <span className={styles.catCountBadge}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Level 2: Training Programs */}
          <div className={styles.programsCol}>
            <div className={styles.menuHeading}>
              {activeCategory ? `${activeCategory.name} Programs` : "PROGRAMS"}
            </div>
            <div className={styles.programsList}>
              {activePrograms.length === 0 ? (
                <div className={styles.noPrograms}>
                  Programs coming soon in this category.
                </div>
              ) : (
                activePrograms.map((prog) => (
                  <Link
                    key={prog._id || prog.slug || prog.id}
                    to={`/trainings/${prog.slug || prog.id || prog._id}`}
                    className={styles.programItem}
                    onClick={() => setOpen(false)}
                  >
                    <div className={styles.programInfo}>
                      <strong className={styles.programTitle}>
                        {prog.title}
                      </strong>
                      <span className={styles.programMeta}>
                        {prog.duration || "Training"}{" "}
                        {prog.mode ? `· ${prog.mode}` : ""}
                      </span>
                    </div>
                    <ArrowRight size={14} className={styles.programArrow} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mega Footer */}
        <div className={styles.megaFooter}>
          <Link
            to="/#trainings"
            className={styles.dropdownFooterLink}
            onClick={(e) => {
              setOpen(false);
              handleHashClick("/#trainings", e);
            }}
          >
            <span>Explore All Training Offerings</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MOBILE TWO-LEVEL TRAINING DROPDOWN
// =========================================================================

function TrainingNavbarDropdownMobileView({
  categories,
  isOpen,
  onToggle,
  icon: Icon,
  closeMenu,
  handleHashClick,
}) {
  const [expandedCat, setExpandedCat] = useState(null);

  const toggleCategory = (catId) => {
    setExpandedCat((prev) => (prev === catId ? null : catId));
  };

  return (
    <div className={styles.mobileDropdown}>
      <button
        type="button"
        className={styles.mobileDropdownTrigger}
        onClick={onToggle}
      >
        {Icon && <Icon size={18} />}
        <span>Training</span>
        <ChevronDown
          size={16}
          className={isOpen ? styles.chevronOpen : ""}
        />
      </button>

      <div
        className={`${styles.mobileDropdownMenu} ${
          isOpen ? styles.mobileDropdownOpen : ""
        }`}
      >
        {categories.map((cat) => {
          const catId = cat._id || cat.slug;
          const isCatOpen = expandedCat === catId;
          const progs = cat.trainings || [];

          return (
            <div key={catId} className={styles.mobileCategoryGroup}>
              <button
                type="button"
                className={styles.mobileCategoryTrigger}
                onClick={() => toggleCategory(catId)}
              >
                <span>{cat.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className={styles.mobileCatBadge}>{progs.length}</span>
                  <ChevronDown
                    size={14}
                    className={isCatOpen ? styles.chevronOpen : ""}
                  />
                </div>
              </button>

              {isCatOpen && (
                <div className={styles.mobileSubProgramList}>
                  {progs.length === 0 ? (
                    <span className={styles.noPrograms}>Coming soon</span>
                  ) : (
                    progs.map((prog) => (
                      <Link
                        key={prog._id || prog.slug || prog.id}
                        to={`/trainings/${prog.slug || prog.id || prog._id}`}
                        onClick={closeMenu}
                        className={styles.mobileSubProgramLink}
                      >
                        <div>
                          <div className={styles.mobileSubProgramTitle}>
                            {prog.title}
                          </div>
                          <div className={styles.mobileSubProgramSub}>
                            {prog.duration} · {prog.mode}
                          </div>
                        </div>
                        <ArrowRight size={14} />
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}

        <Link
          to="/#trainings"
          onClick={(e) => {
            closeMenu();
            handleHashClick("/#trainings", e);
          }}
          className={styles.mobileViewAllLink}
        >
          <span>View All Training Programs</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// =========================================================================
// STANDARD DROPDOWNS (SERVICES, PRODUCTS)
// =========================================================================

function NavbarDropdown({ title, items, viewAllLink, handleHashClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.dropdown}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.dropdownTrigger}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <ChevronDown size={15} />
      </button>

      <div
        className={`${styles.dropdownMenu} ${
          open ? styles.dropdownMenuVisible : ""
        }`}
      >
        {items.map((item, index) => (
          <Link
            key={item._id || item.slug || item.id}
            to={`/#${title.toLowerCase().replace(/\s+/g, "-")}-${
              item.slug || item.id || item._id
            }`}
            onClick={(e) => {
              setOpen(false);
              handleHashClick(
                `/#${title.toLowerCase().replace(/\s+/g, "-")}-${
                  item.slug || item.id || item._id
                }`,
                e
              );
            }}
            className={styles.dropdownItem}
          >
            <span className={styles.dropdownNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item.title}</span>
            <ArrowRight size={15} className={styles.dropdownArrow} />
          </Link>
        ))}

        <Link
          to={viewAllLink}
          className={styles.dropdownFooter}
          onClick={(e) => {
            setOpen(false);
            handleHashClick(viewAllLink, e);
          }}
        >
          View All {title}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function NavbarDropdownMobileView({
  title,
  items,
  isOpen,
  onToggle,
  icon: Icon,
  closeMenu,
  handleHashClick,
}) {
  return (
    <div className={styles.mobileDropdown}>
      <button
        type="button"
        className={styles.mobileDropdownTrigger}
        onClick={onToggle}
      >
        {Icon && <Icon size={18} />}
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={isOpen ? styles.chevronOpen : ""}
        />
      </button>

      <div
        className={`${styles.mobileDropdownMenu} ${
          isOpen ? styles.mobileDropdownOpen : ""
        }`}
      >
        {items.map((item) => (
          <Link
            key={item._id || item.slug || item.id}
            to={`/#${title.toLowerCase().replace(/\s+/g, "-")}-${
              item.slug || item.id || item._id
            }`}
            onClick={(e) => {
              closeMenu();
              handleHashClick(
                `/#${title.toLowerCase().replace(/\s+/g, "-")}-${
                  item.slug || item.id || item._id
                }`,
                e
              );
            }}
          >
            {item.title}
            <ArrowRight size={15} />
          </Link>
        ))}
      </div>
    </div>
  );
}
