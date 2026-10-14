import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";

import usePublicContent from "../../hooks/usePublicContent";
import styles from "./Services.module.css";

function ServiceCard({ service, index, isHighlighted }) {
  const [imgError, setImgError] = useState(false);
  const cardId = `services-${service.slug || service.id || service._id}`;
  const hasImage = Boolean(service.image && !imgError);

  return (
    <article
      id={cardId}
      className={`${styles.card} ${isHighlighted ? styles.highlighted : ""}`}
      style={{
        "--accent": service.color || "#2563eb",
      }}
    >
      {/* Service Image / Graceful Fallback */}
      <div className={styles.imageContainer}>
        {hasImage ? (
          <img
            src={service.image}
            alt={service.title}
            className={styles.cardImage}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imageFallback}>
            <div className={styles.fallbackPattern} />
            <div
              className={styles.fallbackAccentBlob}
              style={{
                background: `radial-gradient(circle, ${
                  service.color || "#2563eb"
                }30 0%, transparent 70%)`,
              }}
            />
            <div className={styles.fallbackBadge}>
              <span className={styles.fallbackTag}>SERVICE</span>
              <span className={styles.fallbackTitle}>{service.title}</span>
            </div>
          </div>
        )}

        <span className={styles.orderBadge}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Card Content */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{service.title}</h3>

        <p className={styles.cardDescription}>{service.description}</p>

        {service.features && service.features.length > 0 && (
          <div className={styles.featuresWrapper}>
            <div className={styles.featuresList}>
              {service.features.slice(0, 4).map((feature, fIndex) => (
                <span key={fIndex} className={styles.featureChip}>
                  <Check size={13} className={styles.featureCheck} />
                  <span>{feature}</span>
                </span>
              ))}
              {service.features.length > 4 && (
                <span className={styles.moreFeatures}>
                  +{service.features.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className={styles.cardFooter}>
          <a
            href="/#contact"
            className={styles.exploreLink}
            onClick={(e) => {
              const contactElem = document.getElementById("contact");
              if (contactElem) {
                e.preventDefault();
                contactElem.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span>Explore Service</span>
            <ArrowUpRight size={16} className={styles.exploreArrow} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const { items: services, loading, error } = usePublicContent("services");
  const [highlightedId, setHighlightedId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash || !location.hash.startsWith("#services-")) {
      return;
    }

    const serviceKey = location.hash.replace("#services-", "");
    const matchingService = services.find(
      (s) => (s.slug || s.id || s._id) === serviceKey
    );

    if (matchingService) {
      const elementId = `services-${matchingService.slug || matchingService.id || matchingService._id}`;
      setHighlightedId(elementId);

      const scrollTimer = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);

      const unhighlightTimer = setTimeout(() => {
        setHighlightedId(null);
      }, 3000);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(unhighlightTimer);
      };
    }
  }, [location.hash, services]);

  if (loading) {
    return (
      <section className={styles.services} id="services" aria-label="Services">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.headingBlock}>
              <span className={styles.eyebrow}>WHAT WE DO</span>
              <h2>
                Solutions built for
                <span> meaningful growth.</span>
              </h2>
            </div>
            <p className={styles.sectionIntro}>
              From strategy to execution, we help ambitious organizations solve
              complex problems and turn opportunities into measurable results.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonBody}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonTextShort} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.services} id="services" aria-label="Services">
        <div className={styles.container}>
          <div className={styles.errorState} role="alert">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className={styles.services} id="services" aria-label="Services">
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>No services currently available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.services} id="services" aria-label="Services">
      <div className={styles.container}>
        {/* ================================
            SECTION HEADER
        ================================= */}
        <div className={styles.sectionHeader}>
          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>WHAT WE DO</span>
            <h2>
              Solutions built for
              <span> meaningful growth.</span>
            </h2>
          </div>

          <p className={styles.sectionIntro}>
            From strategy to execution, we help ambitious organizations solve
            complex problems and turn opportunities into measurable results.
          </p>
        </div>

        {/* ================================
            RESPONSIVE SERVICES GRID
        ================================= */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <ServiceCard
              key={service._id || service.slug || index}
              service={service}
              index={index}
              isHighlighted={
                highlightedId ===
                `services-${service.slug || service.id || service._id}`
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
