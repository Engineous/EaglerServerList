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

const CommentBox = ({ avatar, value, onChange }) => (
    <div
        style={{
            margin: "10px 0",
            width: "50vw",
        }}
    >
        <Input
            value={value}
            type="text"
            startIcon={<img src={avatar} />}
            onChange={onChange}
            placeholder="Type a comment..."
        />
    </div>
);

export default CommentBox;
