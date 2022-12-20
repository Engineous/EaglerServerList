import styles from "./Badge.module.css";

const Badge = ({ icon, color, children, inline }) => (
    <div
        className={inline ? styles.inlineBadge : styles.badge}
        style={{
            color,
        }}
    >
        {icon}
        {children}
    </div>
);

export default Badge;
