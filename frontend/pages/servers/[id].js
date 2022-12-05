import Head from "next/head";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import Button from "../../components/button";
import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Timestamp from "react-timestamp";
import api from "../../api";
import Link from "next/link";
import { MdAddComment } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import CommentBox from "../../components/commentBox";
import Comment from "../../components/comment";
import { InnerLoading } from "../../components/loading";
import { GoVerified } from "react-icons/go";

export default function ServerInfo() {
    const [serverInfo, setServerInfo] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [voting, setVoting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const router = useRouter();
    const { id } = router.query;

    const postComment = () => {
        setCommentContent("");
        setPostingComment(true);
        setTimeout(() => setPostingComment(false), 1000);
    };

    const handleVote = (value) => {
        setVoting(true);
        setTimeout(() => setVoting(false), 1000);
    }

    useEffect(() => {
        api.getServer(id)
            .then((data) => {
                setServerInfo(data.data);
                /**
                 * The code below is made redundant by a recent backend
                 * change.
                 */
                // api.getSpecificUser(data.data.owner)
                //     .then((userData) => {
                //         setUserInfo(userData.data);
                //         setLoading(false);
                //     })
                //     .catch(() => {
                //         setLoading(false);
                //     });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);
    return (
        <>
            <Head>
                <title>
                    Eagler Server List |{" "}
                    {serverInfo ? serverInfo.name : "Unknown Server"}
                </title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    property="og:description"
                    content={
                        serverInfo ? `View information about ${serverInfo.user.username}'s server.` : "Unknown Server"
                    }
                />
                <meta
                    property="twitter:description"
                    content={
                        serverInfo ? `View information about ${serverInfo.user.username}'s server.` : "Unknown Server"
                    }
                />
                <meta property="theme-color" content="#FB8464" />
                <meta
                    property="og:title"
                    content={`Eagler Server List - ${
                        serverInfo ? serverInfo.name : "Unknown Server"
                    }`}
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.root}>
                <Navbar />
                {loading ? (
                    <InnerLoading />
                ) : (
                    <>
                        {serverInfo ? (
                            <>
                                <div className={styles.center}>
                                    <h1 className={styles.title}>
                                        {serverInfo.name}{" "}{serverInfo.approved && <GoVerified color="#fb8464" />}
                                    </h1>
                                    <p style={{ fontsize: "5px" }}>
                                        By: {serverInfo.user.username}
                                    </p>
                                    <br />
                                    <p>IP: {serverInfo.address}</p>
                                    <p>{serverInfo.description}</p>
                                </div>
                                <div className={styles.comments}>
                                    {user ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 0 10px 0",
                                            }}
                                        >
                                            
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                margin: "0 0 10px 0",
                                                gap: "10px",
                                            }}>
                                                {voting ? (
                                                    <CircularProgress size={39} />
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="#0e0e0e"
                                                            iconColor="#fb8464"
                                                            icon={<AiFillLike />}
                                                            onClick={() => handleVote(true)}
                                                        >
                                                            Upvote
                                                        </Button>
                                                        <Button
                                                            color="#0e0e0e"
                                                            iconColor="#fb8464"
                                                            icon={<AiFillDislike />}
                                                            onClick={() => handleVote(false)}
                                                        >
                                                            Downvote
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                            <CommentBox
                                                avatar={user.avatar}
                                                onChange={setCommentContent}
                                                value={commentContent}
                                            />
                                            {postingComment ? (
                                                <CircularProgress size={39} />
                                            ) : (
                                                <Button
                                                    icon={<MdAddComment />}
                                                    iconColor="#fb8464"
                                                    color="#0e0e0e"
                                                    onClick={postComment}
                                                    disabled={
                                                        commentContent == ""
                                                    }
                                                >
                                                    Post
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p>
                                                You must login to be able to
                                                post comments.
                                            </p>
                                            <br />
                                        </div>
                                    )}
                                    {serverInfo.comments.map(
                                        (comment, index) => (
                                            <Comment
                                                comment={comment}
                                                key={index}
                                            />
                                        )
                                    )}
                                    {serverInfo.comments.length < 1 && (
                                        <p className={styles.center}>
                                            No comments
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100vw",
                                    height: "calc(100vh - 60px)",
                                }}
                            >
                                <h1>
                                    A server with this ID could not be found.
                                </h1>
                                <Link href="/">
                                    <span>Go home?</span>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
