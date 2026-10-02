
import { ArrowRight, Play, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

const nodes = [
  { x: 50, y: 8, delay: "0s" },
  { x: 72, y: 18, delay: "0.5s" },
  { x: 88, y: 38, delay: "1s" },
  { x: 82, y: 65, delay: "1.5s" },
  { x: 62, y: 86, delay: "0.3s" },
  { x: 38, y: 86, delay: "1.2s" },
  { x: 18, y: 65, delay: "0.7s" },
  { x: 12, y: 38, delay: "1.7s" },
  { x: 28, y: 18, delay: "0.9s" },
  { x: 50, y: 28, delay: "1.4s" },
  { x: 67, y: 42, delay: "0.4s" },
  { x: 57, y: 68, delay: "1.8s" },
  { x: 43, y: 68, delay: "0.6s" },
  { x: 33, y: 42, delay: "1.1s" },
];

const connections = [
  [0, 1],
  [0, 8],
  [0, 9],
  [1, 2],
  [1, 9],
  [2, 3],
  [2, 10],
  [3, 4],
  [3, 10],
  [4, 5],
  [4, 11],
  [5, 6],
  [5, 12],
  [6, 7],
  [6, 12],
  [7, 8],
  [7, 13],
  [8, 9],
  [9, 10],
  [9, 13],
  [9, 12],
  [10, 11],
  [10, 12],
  [11, 12],
  [12, 13],
  [13, 9],
];

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.backgroundGlow} />
      <div className={styles.gridBackground} />

      <div className={styles.container}>
        <div className={styles.heroContent}>

          {/* LEFT SIDE */}
          <div className={styles.heroText}>

            {/* <div className={styles.badge}>
              <span className={styles.badgeIcon}>
                <Sparkles size={14} />
              </span>

              AI-POWERED STRATEGY
            </div> */}

            <h1>
              Turn complex ideas into{" "}
              <span>intelligent growth.</span>
            </h1>

            <p>
              We combine strategy, technology, and artificial intelligence
              to help ambitious organizations solve complex problems and
              build what comes next.
            </p>

            <div className={styles.actions}>
              <a
                href="#contact"
                className={`${styles.button} ${styles.primaryButton}`}
              >
                Start a Conversation
                <ArrowRight size={18} />
              </a>

              <a
                href="#services"
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                <Play size={16} />
                Explore Services
              </a>
            </div>

            {/* <div className={styles.stats}>
              <div>
                <strong>10+</strong>
                <span>Years experience</span>
              </div>

              <div>
                <strong>250+</strong>
                <span>Clients served</span>
              </div>

              <div>
                <strong>500+</strong>
                <span>Projects delivered</span>
              </div>
            </div> */}

          </div>

          {/* RIGHT SIDE */}
          <div className={styles.visual}>

            <div className={styles.orbGlow} />

            <div className={styles.aiOrb}>

              <div className={styles.orbit} />
              <div className={styles.orbit} />
              <div className={styles.orbit} />

              <div className={styles.network}>

                <svg
                  className={styles.connections}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {connections.map(([from, to], index) => {
                    const start = nodes[from];
                    const end = nodes[to];

                    return (
                      <line
                        key={index}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                      />
                    );
                  })}
                </svg>

                {nodes.map((node, index) => (
                  <span
                    key={index}
                    className={styles.node}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      animationDelay: node.delay,
                    }}
                  />
                ))}

              </div>

              <div className={styles.core}>
                <div className={styles.coreInner}>
                  <span className={styles.corePulse} />

                  <div className={styles.aiText}>
                    <small></small>
                    <strong>TechZen</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* FLOATING CARD */}
            <div
              className={`${styles.floatingCard} ${styles.cardTop}`}
            >
              <div className={styles.statusDot} />

              <div>
                <strong>AI Intelligence</strong>
                <span>Processing strategy</span>
              </div>
            </div>

            <div
              className={`${styles.floatingCard} ${styles.cardBottom}`}
            >
              <span className={styles.arrowIcon}>↗</span>

              <div>
                <strong>+42.8%</strong>
                <span>Growth potential</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span />
        Scroll to explore
      </div>
    </section>
  );
}
