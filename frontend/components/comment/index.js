import Link from "next/link";
import Timestamp from "react-timestamp";
import styles from "./Comment.module.css";

const Comment = ({ comment, inline }) => {
    return inline ? (
        <>
            <div className={styles.inlineBox}>
                <div>
                    <div className={styles.poster}>
                        <img src={comment.poster.avatar} />
                        <Link href={`/users/${comment.poster.uuid}`}>
                            {comment.poster.username}
                        </Link>{" "}
                        <Timestamp
                            style={{
                                color: "#535353",
                                marginLeft: "5px",
                            }}
                            relative
                            date={comment.postedAt}
                        />
                    </div>
                    <br />{" "}
                </div>
                <p className={styles.comment}>{comment.content}</p>
            </div>
        </>
    ) : (
        <>
            <div className={styles.box}>
                <div>
                    <div className={styles.poster}>
                        <img src={comment.poster.avatar} />
                        <Link href={`/users/${comment.poster.uuid}`}>
                            {comment.poster.username}
                        </Link>{" "}
                        <Timestamp
                            style={{
                                color: "#535353",
                                marginLeft: "5px",
                            }}
                            relative
                            date={comment.postedAt}
                        />
                    </div>
                    <br />{" "}
                </div>
                <p className={styles.comment}>{comment.content}</p>
            </div>
            <br />
        </>
    );
};

export default Comment;
