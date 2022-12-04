import styles from "./Button.module.css";

const Button = ({ color, icon, children, onClick, style }) => {
    return (
        <button
            style={{
                ...style,
                backgroundColor: color,
            }}
            className={styles.button}
            onClick={onClick}
        >
            <div className={styles.buttonIcon}>{icon}</div>
            {children}
        </button>
    );
};

export default Button;
