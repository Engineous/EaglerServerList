import Timestamp from "react-timestamp";
import styles from "./Userbox.module.css";
import { FaCode } from "react-icons/fa";
import Badge from "../badge";
import { FaUserCircle, FaServer, FaCommentAlt } from "react-icons/fa";
import Card from "../card";
import { MdShield } from "react-icons/md";
import Server from "../server";
import Comment from "../comment";

const Userbox = ({ user }) => {
    const { servers, comments } = user;
    return (
        <div className={styles.toprow}>
            <Card icon={<FaUserCircle />} text="Profile">
                <div className={styles.profile}>
                    <img src={user.avatar} />
                    <div className={styles.details}>
                        <h2>
                            {user.username}{" "}
                            {user.admin && (
                                <Badge icon={<MdShield />} color="#fb8464">
                                    Admin
                                </Badge>
                            )}
                        </h2>
                        <p>
                            Joined: <Timestamp date={user.createdAt} />
                        </p>
                    </div>
                </div>
            </Card>
            <Card icon={<FaServer />} text="Owned Servers">
                {servers ? (
                    servers.map((server, index) => (
                        <Server server={server} key={index} inline />
                    ))
                ) : (
                    <p>This user does not have any servers.</p>
                )}
            </Card>
            <Card icon={<FaCommentAlt />} text="Recent Comments">
                {comments ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {comments.map((comment, index) => (
                            <Comment comment={comment} key={index} inline />
                        ))}
                    </div>
                ) : (
                    <p>This user does not have any recent comments.</p>
                )}
            </Card>
        </div>
    );
};
export default Userbox;
