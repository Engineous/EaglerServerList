import styles from "./Badge.module.css";

const Badge = ({ icon, color, children }) => (
    <div
        className={styles.badge}
        style={{
            color,
        }}
    >
        {icon}
        {children}
    </div>
);

export default Badge;
