import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { company, Tranings } from "../../data/siteData";
import styles from "./Navbar.module.css";
import usePublicContent from "../../hooks/usePublicContent";



import {
  BriefcaseBusiness,
  Target,
  Route,
  FolderCode,
  MessagesSquare,
  House,
  UsersRound
  
} from "lucide-react";






export default function Navbar() {
  const { items: projects } = usePublicContent("projects");
  const { items: services } = usePublicContent("services");

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileTrainingsOpen, setMobileTrainingsOpen] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
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
        className={`${styles.backdrop} ${ open ? styles.backdropVisible : "" }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          <div className={styles.navWrap}>

            {/* LOGO */}
            {/* <Link
              className={styles.brand}
              to="/#home"
              onClick={closeMenu}
              aria-label={`${company.name} ${company.descriptor} home`}
            >
              <span className={styles.brandMark}>Tz</span>

              <span className={styles.brandText}>
                {company.name}

                <span className={styles.brandMuted}>
                  {company.descriptor}
                </span>
              </span>
            </Link> */}

            <img className={styles.logo} src="TechZenLogo.png" alt="" />


            {/* DESKTOP NAV */}
            <nav
              className={styles.desktopNav}
              aria-label="Primary navigation"
            >
              {/* HOME LINKS */}
              {homeLinks.slice(0, 2).map(([label, href]) => (
                <Link key={href} to={href}>
                  {label}
                </Link>
              ))}

              

              <NavbarDropdown
                title="Services"
                items={services}
                viewAllLink="/#services"
              />

              <NavbarDropdown
                title="Projects"
                items={projects}
                viewAllLink="/#projects"
              />

              <NavbarDropdown
                title="Trainings"
                items={Tranings}
                viewAllLink="/#trainings"
              />



              {/* WHY US */}
              <Link to="/#why-us">
                Why Us
              </Link>

              {/* PROCESS */}
              <Link to="/#process">
                Process
              </Link>

              {/* FAQ */}
              <Link to="/#faq">
                FAQ
              </Link>

              {/* CTA */}
              <Link
                className={styles.navCta}
                to="/#contact"
              >
                Book a Consultation
                <ArrowRight size={16} />
              </Link>
            </nav>





            {/* MOBILE MENU BUTTON */}
            <button
              className={`${styles.menuButton} ${
                open ? styles.menuButtonOpen : ""
              }`}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobileNav"
              aria-label={
                open
                  ? "Close navigation"
                  : "Open navigation"
              }
            >
              {open ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <aside
        id="mobileNav"
        className={`${styles.mobileSidebar} ${
          open ? styles.sidebarOpen : ""
        }`}
        aria-hidden={!open}
      >
        <div className={styles.sidebarInner}>


          <nav className={styles.mobileNav}>

            {/* HOME */}
            <Link
              to="/#home"
              onClick={closeMenu}
            >
              
              <House />
              <span>Home</span>
              {/* <ArrowRight size={17} /> */}
            </Link>

            {/* ABOUT */}
            <Link
              to="/#about"
              onClick={closeMenu}
            >
      
              <UsersRound />
              <span>About</span>
              {/* <ArrowRight size={17} /> */}
            </Link>

            <NavbarDropdownMobileView
              title="Services"
              items={services}
              isOpen={mobileServicesOpen}
              onToggle={() =>
                setMobileServicesOpen(
                  !mobileServicesOpen
                )
              }
              icon={BriefcaseBusiness}
              closeMenu={closeMenu}
            />

            <NavbarDropdownMobileView
              title="Projects"
              items={projects}
              isOpen={mobileProjectsOpen}
              onToggle={() =>
                setMobileProjectsOpen(
                  !mobileProjectsOpen
                )
              }
              icon={BriefcaseBusiness}
              closeMenu={closeMenu}
            />

            <NavbarDropdownMobileView
              title="Trainings"
              items={Tranings}
              isOpen={mobileTrainingsOpen}
              onToggle={() =>
                setMobileTrainingsOpen(
                  !mobileTrainingsOpen
                )
              }
              icon={BriefcaseBusiness}
              closeMenu={closeMenu}
            />




            {/* WHY US */}
            <Link
              to="/#why-us"
              onClick={closeMenu}
            >
              <Target />
              <span>Why Us</span>
              {/* <ArrowRight size={17} /> */}
            </Link>

            {/* PROCESS */}
            <Link
              to="/#process"
              onClick={closeMenu}
            >
             
              <Route />
              <span>Process</span>
              {/* <ArrowRight size={17} /> */}
            </Link>

            {/* FAQ */}
            <Link
              to="/#faq"
              onClick={closeMenu}
            >
         
              <MessagesSquare />
              <span>FAQ</span>
              {/* <ArrowRight size={17} /> */}
            </Link>

            {/* CTA */}
            <Link
              className={styles.mobileCta}
              to="/#contact"
              onClick={closeMenu}
            >
              Book a Consultation
              <ArrowRight size={17} />
            </Link>

          </nav>

          <div className={styles.sidebarFooter}>
            <span>© {new Date().getFullYear()}</span>
            <span>{company.name}</span>
          </div>

        </div>
      </aside>


    </>
  );
}




const NavbarDropdownMobileView = ({
  title,
  items,
  isOpen,
  onToggle,
  icon: Icon,
  closeMenu,
}) => {
  return (
    <div className={styles.mobileDropdown}>
      <button
        className={styles.mobileDropdownTrigger}
        onClick={onToggle}
      >
        {Icon && <Icon />}

        <span>{title}</span>

        <ChevronDown
          size={16}
          className={
            isOpen ? styles.chevronOpen : ""
          }
        />
      </button>

      <div
        className={`${styles.mobileDropdownMenu} ${
          isOpen
            ? styles.mobileDropdownOpen
            : ""
        }`}
      >
        {items.map((item) => (
          <Link
            key={item._id || item.slug || item.id} 
            to={`/#${title.toLowerCase().replace(/\s+/g, '-')}-${item.slug || item.id || item._id}`}
            onClick={closeMenu}
          >
            {item.title}
            <ArrowRight size={15} />
          </Link>
        ))}
      </div>
    </div>
  );
};




const NavbarDropdown = ({ title, items, viewAllLink }) => {
  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownTrigger}>
        {title}
        <ChevronDown size={15} />
      </button>

      <div className={styles.dropdownMenu}>
        {items.map((item, index) => (
          <Link
            key={item._id || item.slug || item.id}
            // to={`/#${title.toLowerCase().replace(/\s+/g, '-')}-${item.id}`}
            to={`/#${title.toLowerCase().replace(/\s+/g, '-')}-${item.slug || item.id || item._id}`}
            className={styles.dropdownItem}
          >
            <span className={styles.dropdownNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>

            <span>{item.title}</span>

            <ArrowRight
              size={15}
              className={styles.dropdownArrow}
            />
          </Link>
        ))}

        <Link
          to={viewAllLink}
          className={styles.dropdownFooter}
        >
          View All {title}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

