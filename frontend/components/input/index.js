import styles from "./Input.module.css";

const Input = ({ value, startIcon, placeholder, onChange, type }) => (
    <div className={styles.inputContainer}>
        {startIcon && <div className={styles.inputStartIcon}>{startIcon}</div>}
        <div className={styles.input}>
            <input
                value={value}
                type={type}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    </div>
);

export default Input;
