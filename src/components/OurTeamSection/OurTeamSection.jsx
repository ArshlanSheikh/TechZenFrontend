import styles from "./OurTeamSection.module.css";
import usePublicContent from "../../hooks/usePublicContent";

// Duplicate for seamless infinite scroll
const OurTeam = () => {
  const { items: teamMembers, loading } = usePublicContent("team");
  const sliderData = [...teamMembers, ...teamMembers];

  if (!loading && teamMembers.length === 0) return null;

  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Meet Our Team</h2>

        <div className={styles.slider}>
          <div className={styles.track}>
            {sliderData.map((member, index) => (
              <div
                key={`${member._id}-${index}`}
                className={styles.card}
              >
                {member.image ? <img src={member.image} alt={member.name} className={styles.image} loading="lazy" /> : <div className={styles.image} aria-label={member.name}>{member.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</div>}

                <h3>{member.name}</h3>

                <p>{member.designation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;