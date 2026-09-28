import { useEffect, useState } from "react";
import { company } from "../../data/siteData";
import { publicContentApi } from "../../Api/CmsApi";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const [managedCompany, setManagedCompany] = useState(null);
  const companyInfo = { ...company, ...managedCompany };

  useEffect(() => {
    publicContentApi.company().then(setManagedCompany).catch(() => {});
  }, []);

  return (
    <footer className={styles.siteFooter}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>

          {/* BRAND */}
          <div className={styles.footerAbout}>
            <a className={styles.brand} href="#home">
              <span className={styles.brandMark}>T</span>

              <span className={styles.brandText}>
                {companyInfo.name}
                <span className={styles.brandMuted}>
                  {companyInfo.descriptor}
                </span>
              </span>
            </a>

            <p>
              Strategy, transformation, and practical growth support
              for ambitious organizations.
            </p>
          </div>

          {/* EXPLORE */}
          <div className={styles.footerColumn}>
            <h4>Explore</h4>

            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#faq">FAQ</a>
          </div>

          {/* SERVICES */}
          <div className={styles.footerColumn}>
            <h4>Services</h4>

            <a href="#services">Strategy</a>
            <a href="#services">Digital Transformation</a>
            <a href="#services">Marketing</a>
            <a href="#services">Management</a>
          </div>

          {/* CONNECT */}
          <div className={styles.footerColumn}>
            <h4>Connect</h4>

            <a href={`mailto:${companyInfo.email}`}>
              {companyInfo.email}
            </a>

            <a
              href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
            >
              {companyInfo.phone}
            </a>

            <a href="#contact">
              Book a Consultation
            </a>
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.footerBottomWrapper}>
        <div className={`${styles.container} ${styles.footerBottom}`}>

          <span>
            © {year} {companyInfo.name} {companyInfo.descriptor}.
            All rights reserved.
          </span>

          <div className={styles.legalLinks}>
            <a href="/privacy">
              Privacy Policy
            </a>

            <a href="/terms">
              Terms &amp; Conditions
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}