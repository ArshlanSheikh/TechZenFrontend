
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Smartphone,
} from "lucide-react";

import usePublicContent from "../../hooks/usePublicContent";
import styles from "./Services.module.css";

const icons = {
  analytics: BarChart3,
  business: BriefcaseBusiness,
  code: Code2,
  globe: Globe2,
  marketing: Megaphone,
  mobile: Smartphone,
};

export default function Services() {
  const { items: services, loading } = usePublicContent("services");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const serviceId = location.hash.replace("#services-", "");
    const serviceIndex = services.findIndex(
      (service) => (service.slug || service.id || service._id) === serviceId
    );

    if (serviceIndex >= 0) {
      setActive(serviceIndex);
      setPaused(true);

      window.requestAnimationFrame(() => {
        document.getElementById("services")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location.hash, services]);


  /*
    Automatically rotate every 2.2 seconds
  */
  useEffect(() => {
    if (paused || loading || services.length === 0) return;

    const interval = setInterval(() => {
      setActive((current) => (current + 1) % services.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, loading, services.length]);

  if (loading) {
    return <section className={styles.services} id="services" aria-label="Services" />;
  }

  if (services.length === 0) return null;

  /*
    Move to previous card
  */
  const previous = () => {
    setActive(
      (current) =>
        (current - 1 + services.length) % services.length
    );
  };

  /*
    Move to next card
  */
  const next = () => {
    setActive(
      (current) =>
        (current + 1) % services.length
    );
  };

  /*
    Calculate where each card should appear.

    - center
    - left-1
    - left-2
    - right-1
    - right-2
  */
  const getPosition = (index) => {
    let difference = index - active;
    if (difference > services.length / 2) {
      difference -= services.length;
    }

    if (difference < -services.length / 2) {
      difference += services.length;
    }

    if (difference === 0) return "center";

    if (difference === -1) return "leftOne";

    if (difference === -2) return "leftTwo";

    if (difference === 1) return "rightOne";

    if (difference === 2) return "rightTwo";

    return "hidden";
  };

  return (
    <section
      className={styles.services}
      id="services"
    >
      <div className={styles.container}>

        {/* ================================
            SECTION HEADER
        ================================= */}

        <div className={styles.sectionHeader}>

          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>
              WHAT WE DO
            </span>

            <h2>
              Solutions built for
              <span> meaningful growth.</span>
            </h2>
          </div>

          {/* <p className={styles.sectionIntro}>
            From strategy to execution, we help ambitious
            organizations solve complex problems and turn
            opportunities into measurable results.
          </p> */}

        </div>


        {/* ================================
            3D CAROUSEL
        ================================= */}

        <div
          className={styles.stage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* Background glow */}
          <div className={styles.glow} />

          {/* Decorative rings */}
          <div className={styles.ring } />
          <div className={styles.ring} />
          <div className={styles.ring } />


          <div className={styles.carousel}>

            {services.map((service, index) => {
              const Icon = icons[service.icon] || BriefcaseBusiness;

              const position = getPosition(index);

              return (
                <article
                  id={`services-${service.slug || service.id || service._id}`}
                  key={service._id || service.slug || service.title}
                  className={`${styles.card} ${
                    styles[position]
                  }`}
                  style={{
                    "--accent": service.color,
                  }}
                  onClick={() => setActive(index)}
                >

                  {/* Card top */}

                  <div className={styles.cardTop}>

                    <div className={styles.iconBox}>
                      <Icon
                        size={24}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span className={styles.cardNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>


                  {/* Card content */}

                  <div className={styles.cardContent}>

                    <h3>
                      {service.title}
                    </h3>

                    <p>
                      {service.description}
                    </p>


                    <div className={styles.features}>

                      {service.features.map(
                        (feature) => (
                          <span key={feature}>
                            <CheckCircle2
                              size={14}
                            />

                            {feature}
                          </span>
                        )
                      )}

                    </div>

                  </div>


                  {/* Card bottom */}

                  <div className={styles.cardBottom}>

                    <span>
                      Explore service
                    </span>

                    <div className={styles.arrow}>
                      <ArrowUpRight size={18} />
                    </div>

                  </div>

                </article>
              );
            })}

          </div>


          {/* ================================
              ARROWS
          ================================= */}

          <button
            className={`${styles.carouselButton} ${styles.previousButton}`}
            onClick={previous}
            aria-label="Previous service"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className={`${styles.carouselButton} ${styles.nextButton}`}
            onClick={next}
            aria-label="Next service"
          >
            <ChevronRight size={20} />
          </button>

        </div>


        {/* ================================
            CONTROLS
        ================================= */}

        <div className={styles.controls}>

          <div className={styles.counter}>

            <span className={styles.currentNumber}>
              {String(active + 1).padStart(2, "0")}
            </span>

            <div className={styles.progress}>
              <span
                style={{
                  width: `${
                    ((active + 1) /
                      services.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <span className={styles.totalNumber}>
              {String(services.length).padStart(2, "0")}
            </span>

          </div>


          <div className={styles.currentService}>
            {services[active].title}
          </div>


          <button
            className={styles.pauseButton}
            onClick={() =>
              setPaused((value) => !value)
            }
          >
            {paused
              ? "Resume rotation"
              : "Pause rotation"}
          </button>

        </div>

      </div>
    </section>
  );
}

