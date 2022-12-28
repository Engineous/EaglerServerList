import Timestamp from "react-timestamp";
import styles from "./Userbox.module.css";
import { FaBan, FaCode } from "react-icons/fa";
import Badge from "../badge";
import { FaUserCircle, FaServer, FaCommentAlt } from "react-icons/fa";
import Card from "../card";
import { MdShield } from "react-icons/md";
import Server from "../server";
import Comment from "../comment";
import { useUser } from "../user";
import Button from "../button";

const Userbox = ({ user: userData }) => {
    const { user } = useUser();
    const { servers, comments } = userData;
    return (
        <div className={styles.toprow}>
            <Card icon={<FaUserCircle />} text="Profile">
                <div className={styles.profile}>
                    <img src={userData.avatar} />
                    <div className={styles.details}>
                        <h2>
                            {userData.username}{" "}
                            {userData.admin && (
                                <Badge icon={<MdShield />} color="#fb8464">
                                    Admin
                                </Badge>
                            )}
                        </h2>
                        <p>
                            Joined: <Timestamp date={userData.createdAt} />
                        </p>
                    </div>
                </div>
            </Card>
            <Card icon={<FaServer />} text="Owned Servers">
                {servers && servers.length > 0 ? (
                    servers.map((server, index) => (
                        <Server server={server} key={index} inline />
                    ))
                ) : (
                    <h3>This user does not have any servers.</h3>
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
