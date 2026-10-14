import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaWhatsapp,
  FaInstagram,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";

import { company as fallbackCompany } from "../../data/siteData";
import { publicContentApi } from "../../Api/CmsApi";
import usePublicContent from "../../hooks/usePublicContent";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const [managedCompany, setManagedCompany] = useState(null);
  const { items: dynamicServices } = usePublicContent("services");
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    publicContentApi
      .company()
      .then((data) => {
        if (isMounted && data) {
          setManagedCompany(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Use fallbackCompany while managedCompany has not loaded
  const companyInfo = managedCompany
    ? { ...fallbackCompany, ...managedCompany }
    : fallbackCompany;

  const cleanPhone = companyInfo.phone
    ? companyInfo.phone.replace(/[^0-9]/g, "")
    : "";

  /**
   * Resolve dynamic social URLs:
   * - While backend data is loading / not yet fetched: use siteData fallback values.
   * - Once backend data is fetched successfully: use backend values.
   * - If a platform URL in the backend is empty or missing: handle safely.
   */
  const resolveSocialUrl = (key, fallbackUrl) => {
    if (managedCompany) {
      const val = managedCompany[key];
      return typeof val === "string" ? val.trim() : "";
    }
    return (fallbackUrl || "").trim();
  };

  const resolveWhatsAppUrl = (fallbackUrl) => {
    if (managedCompany) {
      if (managedCompany.whatsapp && managedCompany.whatsapp.trim()) {
        const raw = managedCompany.whatsapp.trim();
        return raw.startsWith("http")
          ? raw
          : `https://wa.me/${raw.replace(/[^0-9]/g, "")}`;
      }
      if (managedCompany.phone && managedCompany.phone.trim()) {
        const digits = managedCompany.phone.replace(/[^0-9]/g, "");
        return `https://wa.me/${digits.length === 10 ? "91" + digits : digits}`;
      }
      return "";
    }
    return (fallbackUrl || "").trim();
  };

  const rawSocialLinks = [
    {
      name: "LinkedIn",
      href: resolveSocialUrl("linkedin", fallbackCompany.linkedin),
      icon: FaLinkedinIn,
      hoverColor: "#0a66c2",
      label: "TechZen on LinkedIn",
    },
    {
      name: "Facebook",
      href: resolveSocialUrl("facebook", fallbackCompany.facebook),
      icon: FaFacebookF,
      hoverColor: "#1877f2",
      label: "TechZen on Facebook",
    },
    {
      name: "WhatsApp",
      href: resolveWhatsAppUrl(fallbackCompany.whatsapp),
      icon: FaWhatsapp,
      hoverColor: "#25d366",
      label: "Chat with TechZen on WhatsApp",
    },
    {
      name: "Instagram",
      href: resolveSocialUrl("instagram", fallbackCompany.instagram),
      icon: FaInstagram,
      hoverColor: "#e4405f",
      label: "TechZen on Instagram",
    },
    {
      name: "GitHub",
      href: resolveSocialUrl("github", fallbackCompany.github),
      icon: FaGithub,
      hoverColor: "#94a3b8",
      label: "TechZen on GitHub",
    },
    {
      name: "Twitter",
      href: resolveSocialUrl("twitter", fallbackCompany.twitter),
      icon: FaXTwitter,
      hoverColor: "#1da1f2",
      label: "TechZen on X (Twitter)",
    },
  ];

  // Only render social links that have a safe, non-empty URL
  const activeSocialLinks = rawSocialLinks.filter((item) => Boolean(item.href));

  const handleSmoothScroll = (hash) => {
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const displayedServices =
    dynamicServices && dynamicServices.length > 0
      ? dynamicServices.slice(0, 5)
      : [
          { title: "Custom Software Development", slug: "custom-software-development" },
          { title: "Mobile App Development", slug: "mobile-app-development" },
          { title: "ERP Development", slug: "erp-development" },
          { title: "Web Development", slug: "web-devlopment" },
          { title: "Cybersecurity Solutions", slug: "cybersecurity-solutions" },
        ];

  return (
    <footer className={styles.siteFooter}>
      {/* Ambient background decoration */}
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* BRAND COLUMN */}
          <div className={styles.brandColumn}>
            <Link
              className={styles.brand}
              to="/#home"
              onClick={() => handleSmoothScroll("#home")}
            >
              <span className={styles.brandMark}>Tz</span>
              <span className={styles.brandText}>
                {companyInfo.name}
                <span className={styles.brandDescriptor}>
                  {companyInfo.descriptor || "Software & Technology"}
                </span>
              </span>
            </Link>

            <p className={styles.brandBio}>
              {companyInfo.introduction ||
                "Delivering robust software engineering, scalable web architectures, and strategic technology solutions that empower ambitious businesses."}
            </p>

            <div className={styles.brandCta}>
              <a
                href="/#contact"
                className={styles.consultationBtn}
                onClick={() => handleSmoothScroll("#contact")}
              >
                <span>Book a Consultation</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* EXPLORE / QUICK LINKS */}
          <div className={styles.navColumn}>
            <h4 className={styles.columnTitle}>Explore</h4>
            <ul className={styles.linkList}>
              <li>
                <Link
                  to="/#about"
                  onClick={() => handleSmoothScroll("#about")}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#services"
                  onClick={() => handleSmoothScroll("#services")}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/#projects"
                  onClick={() => handleSmoothScroll("#projects")}
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  to="/#why-us"
                  onClick={() => handleSmoothScroll("#why-us")}
                >
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link
                  to="/#process"
                  onClick={() => handleSmoothScroll("#process")}
                >
                  Our Process
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq"
                  onClick={() => handleSmoothScroll("#faq")}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* SERVICES */}
          <div className={styles.navColumn}>
            <h4 className={styles.columnTitle}>Services</h4>
            <ul className={styles.linkList}>
              {displayedServices.map((service, index) => {
                const serviceAnchor = `#services-${
                  service.slug || service.id || service._id || index
                }`;
                return (
                  <li key={service._id || service.slug || index}>
                    <Link
                      to={`/${serviceAnchor}`}
                      onClick={() => handleSmoothScroll(serviceAnchor)}
                    >
                      {service.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* GET IN TOUCH / CONTACT DETAILS */}
          <div className={styles.contactColumn}>
            <h4 className={styles.columnTitle}>Get In Touch</h4>
            <div className={styles.contactList}>
              {companyInfo.email && (
                <a
                  href={`mailto:${companyInfo.email}`}
                  className={styles.contactItem}
                  title="Send us an email"
                >
                  <div className={styles.contactIconWrapper}>
                    <Mail size={16} className={styles.contactIcon} />
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Email Us</span>
                    <span className={styles.contactValue}>
                      {companyInfo.email}
                    </span>
                  </div>
                </a>
              )}

              {companyInfo.phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className={styles.contactItem}
                  title="Call our office"
                >
                  <div className={styles.contactIconWrapper}>
                    <Phone size={16} className={styles.contactIcon} />
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Call Us</span>
                    <span className={styles.contactValue}>
                      {companyInfo.phone}
                    </span>
                  </div>
                </a>
              )}

              {companyInfo.location && (
                <div className={styles.contactItemStatic}>
                  <div className={styles.contactIconWrapper}>
                    <MapPin size={16} className={styles.contactIcon} />
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Headquarters</span>
                    <span className={styles.contactValue}>
                      {companyInfo.location}
                    </span>
                  </div>
                </div>
              )}

              {companyInfo.hours && (
                <div className={styles.contactItemStatic}>
                  <div className={styles.contactIconWrapper}>
                    <Clock size={16} className={styles.contactIcon} />
                  </div>
                  <div className={styles.contactText}>
                    <span className={styles.contactLabel}>Office Hours</span>
                    <span className={styles.contactValue}>
                      {companyInfo.hours}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className={styles.footerBottomWrapper}>
        <div className={`${styles.container} ${styles.footerBottom}`}>
          {/* COPYRIGHT */}
          <div className={styles.copyright}>
            <span>
              © {year} {companyInfo.name}{" "}
              {companyInfo.descriptor ? `${companyInfo.descriptor}. ` : ". "}
              All rights reserved.
            </span>
          </div>

          {/* DYNAMIC SOCIAL MEDIA ICONS */}
          <div
            className={styles.socialBar}
            aria-label="Official Social Media Links"
          >
            {activeSocialLinks.map(
              ({ name, href, icon: Icon, hoverColor, label }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIconBtn}
                  aria-label={label}
                  title={name}
                  style={{ "--hover-accent": hoverColor }}
                >
                  <Icon size={16} />
                </a>
              )
            )}
          </div>

          {/* LEGAL LINKS */}
          <div className={styles.legalLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <span className={styles.legalDivider}>•</span>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}