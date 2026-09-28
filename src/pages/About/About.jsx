import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { publicContentApi } from "../../Api/CmsApi";
import styles from "./About.module.css";

const defaultValues = [
  ["01", "Practical", "Recommendations built for real-world execution."],
  ["02", "Personal", "Every engagement is shaped around your context."],
  ["03", "Measurable", "Clear outcomes, milestones, and accountability."],
];

export default function About() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    publicContentApi.company().then(setContent).catch(() => {});
  }, []);

  const values = content?.whyChooseUs?.length
    ? content.whyChooseUs.map((item, index) => [String(index + 1).padStart(2, "0"), item.title, item.description])
    : defaultValues;

  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.splitGrid}>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutPanel}>
              <div className={styles.panelTop}><span>Our perspective</span><span>01 / 04</span></div>
              <div className={styles.quoteMark}>“</div>
              <h3>{content?.mission || "Good strategy is only valuable when people can execute it."}</h3>
              <div className={styles.miniLine} />
              <p>{content?.vision || content?.introduction || "We bridge the gap between boardroom thinking and measurable business action."}</p>
            </div>
            <div className={styles.experienceBadge}><strong>{content?.statistics?.[0]?.value || "10+"}</strong><span>{content?.statistics?.[0]?.label || <>Years of<br />experience</>}</span></div>
          </div>

          <div className={styles.aboutCopy}>
            <p className={styles.eyebrow}>ABOUT US</p>
            <h2>Clarity for today. <em>Momentum for tomorrow.</em></h2>
            {(content?.about || content?.introduction) && <p>{content.about || content.introduction}</p>}
            {content?.mission && <p><strong>Our mission:</strong> {content.mission}</p>}
            {content?.vision && <p><strong>Our vision:</strong> {content.vision}</p>}
            <div className={styles.values}>
              {values.map(([number, title, description]) => <div className={styles.valueItem} key={number}><span>{number}</span><b>{title}</b><small>{description}</small></div>)}
            </div>
            <a className={styles.textLink} href="#contact">Start a conversation <ArrowRight size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}