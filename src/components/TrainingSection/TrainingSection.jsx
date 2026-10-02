import { ArrowRight, Check, Code2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Tranings } from "../../data/siteData";
import styles from "./TrainingSection.module.css";

export default function TrainingSection() {
  return (
    <section className={styles.section} id="trainings">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>LEARN WITH TECHZEN</p>
            <h2>
              Training built around
              <em> practical skills.</em>
            </h2>
          </div>
          <p className={styles.intro}>
            Explore our seasonal training programs and the skills each one
            covers.
          </p>
        </div>

        <div className={styles.trainingGrid}>
          {Tranings.map((training, index) => {
            const Icon = training.icon === "code" ? Code2 : GraduationCap;

            return (
              <article
                className={styles.trainingCard}
                id={`trainings-${training.slug || training.id || training._id}`}
                key={training._id || training.slug || training.id}
                style={{ "--training-accent": training.color || "#2563eb" }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.programNumber}>
                    PROGRAM {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.iconBox}>
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                </div>

                <h3>{training.title}</h3>
                <p className={styles.description}>{training.description}</p>

                <ul className={styles.features}>
                  {training.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link className={styles.contactLink} to="/#contact">
                  Ask about this program
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}