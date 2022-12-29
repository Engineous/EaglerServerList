import styles from "./Input.module.css";

const RichInput = ({ value, startIcon, placeholder, type, onChange }) => (
    <div className={styles.richInputContainer}>
        {startIcon && <div className={styles.inputStartIcon}>{startIcon}</div>}
        <div className={styles.richInput}>
            <textarea
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    </div>
);

export default RichInput;
