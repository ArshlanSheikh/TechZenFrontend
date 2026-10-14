






import { benefits } from "../../data/siteData";
import useCompanyContent from "../../hooks/useCompanyContent";
import styles from "./WhyUs.module.css";

export default function WhyUs() {
  const { company } = useCompanyContent();

  const visibleBenefits =
    company?.whyChooseUs && company.whyChooseUs.length > 0
      ? company.whyChooseUs.map((item, index) => [
          String(index + 1).padStart(2, "0"),
          item.title,
          item.description,
        ])
      : benefits;

  return (
    <section className={styles.section} id="why-us">
      <div className={styles.container}>

        {/* SECTION HEADING */}
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>WHY TECHZEN</p>

          <h2>
            Advice is easy. <em>Progress is the point.</em>
          </h2>

          <p className={styles.description}>
            We measure our value by what changes after the engagement—not by
            the number of slides we produce.
          </p>
        </div>

        {/* BENEFITS */}
        <div className={styles.benefitsGrid}>
          {visibleBenefits.map(([n, t, d]) => (
            <div className={styles.benefit} key={n}>
              <span>{n}</span>

              <h3>{t}</h3>

              <p>{d}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}