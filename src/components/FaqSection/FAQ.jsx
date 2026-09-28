
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import usePublicContent from "../../hooks/usePublicContent";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const { items: faqs, loading } = usePublicContent("faqs");

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.faqGrid}>
          {/* FAQ HEADING */}
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>FAQ</p>

              <h2>
                Questions, answered <em>clearly.</em>
              </h2>
            </div>

            <p>
              Still have a question? Send us a message and
              we'll be happy to discuss your situation.
            </p>

            <a className={styles.textLink} href="#contact">
              Ask us directly
              <ArrowRight size={16} />
            </a>
          </div>

          {/* FAQ LIST */}
          <div className={styles.faqList}>
            {loading ? <p>Loading questions...</p> : faqs.map((faq, i) => {
              const isOpen = open === i;

              return (
                <div
                  className={`${styles.faqItem} ${
                    isOpen ? styles.open : ""
                  }`}
                  key={faq._id}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpen(isOpen ? null : i)
                    }
                  >
                    <span>{faq.question}</span>

                    <Plus
                      size={20}
                      className={styles.plusIcon}
                    />
                  </button>

                  <div
                    className={styles.faqAnswer}
                    style={{
                      maxHeight: isOpen ? "200px" : "0px",
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}