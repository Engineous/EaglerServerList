import styles from "./Button.module.css";

const Button = ({
    color,
    icon,
    iconColor,
    children,
    onClick,
    disabled,
    style,
}) => {
    return disabled ? (
        <button
            style={{
                ...style,
                backgroundColor: "#303030",
            }}
            className={styles.disabledButton}
        >
            <div className={styles.buttonIcon}>{icon}</div>
            {children}
        </button>
    ) : (
        <button
            style={{
                ...style,
                backgroundColor: color,
            }}
            className={styles.button}
            onClick={onClick}
        >
            <div
                className={styles.buttonIcon}
                style={{
                    color: iconColor ?? "#fff",
                    transition: "0.2s all ease-in-out",
                }}
            >
                {icon}
            </div>
            {children}
        </button>
    );
};

export default Button;
