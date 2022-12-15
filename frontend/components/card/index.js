import styles from "./Card.module.css";

const Card = ({ icon, text, color, children }) => (
    <div className={styles.card}>
        <div
            className={styles.header}
            style={{
                color: color ?? "#909090",
            }}
        >
            {icon}
            <p>{text}</p>
        </div>
        <div className={styles.content}>{children}</div>
    </div>
);

export default Card;
