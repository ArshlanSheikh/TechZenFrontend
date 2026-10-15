import {
  ArrowRight,
  Award,
  Calendar,
  Check,
  Clock,
  Code2,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tranings } from "../../data/siteData";
import usePublicContent from "../../hooks/usePublicContent";
import styles from "./TrainingSection.module.css";

export default function TrainingSection() {
  const { items: trainings } = usePublicContent("trainings", Tranings);

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
          {trainings.map((training, index) => {
            const Icon = training.icon === "code" ? Code2 : GraduationCap;
            const bullets =
              Array.isArray(training.features) && training.features.length > 0
                ? training.features
                : Array.isArray(training.whatStudentsWillLearn) &&
                  training.whatStudentsWillLearn.length > 0
                ? training.whatStudentsWillLearn
                : [];

            const categoryName =
              (typeof training.category === "object"
                ? training.category?.name
                : training.category) ||
              training.categoryName ||
              "";

            return (
              <article
                className={styles.trainingCard}
                id={`trainings-${training.slug || training.id || training._id}`}
                key={training._id || training.slug || training.id}
                style={{ "--training-accent": training.color || "#2563eb" }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardTopLeft}>
                    <span className={styles.programNumber}>
                      PROGRAM {String(index + 1).padStart(2, "0")}
                    </span>
                    {categoryName && (
                      <span className={styles.categoryBadge}>
                        {categoryName}
                      </span>
                    )}
                  </div>
                  <span className={styles.iconBox}>
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                </div>

                {training.image && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={training.image}
                      alt={training.title}
                      className={styles.cardImage}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <h3>
                  <Link
                    to={`/trainings/${training.slug || training.id || training._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {training.title}
                  </Link>
                </h3>
                <p className={styles.description}>
                  {training.shortDescription || training.description}
                </p>

                {(training.duration ||
                  training.mode ||
                  training.certificate ||
                  training.batchStartDate ||
                  training.fee) && (
                  <div className={styles.metaRow}>
                    {training.duration && (
                      <span className={styles.metaPill}>
                        <Clock size={12} strokeWidth={2} />
                        <span>{training.duration}</span>
                      </span>
                    )}
                    {training.mode && (
                      <span className={styles.metaPill}>
                        <MapPin size={12} strokeWidth={2} />
                        <span>{training.mode}</span>
                      </span>
                    )}
                    {training.certificate && (
                      <span className={styles.metaPill}>
                        <Award size={12} strokeWidth={2} />
                        <span>Certificate</span>
                      </span>
                    )}
                    {training.batchStartDate && (
                      <span className={styles.metaPill}>
                        <Calendar size={12} strokeWidth={2} />
                        <span>{training.batchStartDate}</span>
                      </span>
                    )}
                    {training.fee && (
                      <span className={styles.feePill}>{training.fee}</span>
                    )}
                  </div>
                )}

                {training.eligibility && (
                  <p className={styles.eligibility}>
                    <strong>Eligibility:</strong> {training.eligibility}
                  </p>
                )}

                {bullets.length > 0 && (
                  <ul className={styles.features}>
                    {bullets.map((feature) => (
                      <li key={feature}>
                        <Check size={15} aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {Array.isArray(training.technologies) &&
                  training.technologies.length > 0 && (
                    <div className={styles.techTags}>
                      {training.technologies.slice(0, 6).map((tech) => (
                        <span key={tech} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                      {training.technologies.length > 6 && (
                        <span className={styles.techTag}>
                          +{training.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                <Link
                  className={styles.contactLink}
                  to={`/trainings/${training.slug || training.id || training._id}`}
                >
                  View Program Details
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