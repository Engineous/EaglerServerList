import styles from "./CommentBox.module.css";
import { MdSend } from "react-icons/md";
import { CircularProgress } from "@mui/material";

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

const CommentBox = ({
    avatar,
    value,
    onChange,
    onClick,
    disabled,
    loading,
}) => (
    <div
        style={{
            margin: "10px 0",
        }}
    >
        <div className={styles.inputContainer}>
            <div className={styles.inputStartIcon}>
                <img src={avatar} />
            </div>
            <form className={styles.commentInput}>
                <input
                    value={value}
                    type="text"
                    placeholder="Type a comment..."
                    onChange={(event) => onChange(event.target.value)}
                    onSubmit={onClick}
                />
                <button
                    className={disabled ? styles.disabledButton : styles.button}
                    onClick={disabled ? () => {} : loading ? () => {} : onClick}
                    type="submit"
                >
                    {loading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <MdSend color={disabled ? "#fff" : "#fb8464"} />
                    )}
                </button>
            </form>
        </div>
    </div>
);

export default CommentBox;
