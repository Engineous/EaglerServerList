import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdAddComment } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { CircularProgress } from "@mui/material";
import { InnerLoading } from "../../components/loading";
import { GoVerified } from "react-icons/go";
import { useNotification } from "../../components/notification";
import Head from "next/head";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import Button from "../../components/button";
import CommentBox from "../../components/commentBox";
import Comment from "../../components/comment";
import api from "../../api";
import Link from "next/link";
import Reaptcha from "reaptcha";

export default function ServerInfo() {
    const [serverInfo, setServerInfo] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [captcha, setCaptcha] = useState(null);
    const [voting, setVoting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const router = useRouter();
    const notify = useNotification();
    const { id } = router.query;

    const postComment = async () => {
        setCaptcha(null);
        window.grecaptcha.reset();
        setPostingComment(true);
        try {
            const data = await api.postComment({
                uuid: serverInfo.uuid,
                content: commentContent,
                captcha,
            });
            if (data.success) {
                setServerInfo({
                    ...serverInfo,
                    comments: [...serverInfo.comments, data.data],
                });
                notify({
                    type: "success",
                    content: "Successfully posted comment.",
                });
            }
        } catch (err) {
            if (!err.repsonse || !err.response.data || !err.response.data.message)
                notify({
                    type: "error",
                    content: "An unknown error occurred.",
                });
            else
                notify({
                    type: "error",
                    content: err.response.data.message,
                });
        }
        setPostingComment(false);
        setCommentContent("");
    };

    const handleVote = (value) => {
        // TODO: implement voting
        setCaptcha(null);
        window.grecaptcha.reset();
        setVoting(true);
        setTimeout(() => setVoting(false), 1000);
    };

    useEffect(() => {
        api.getServer(id)
            .then((data) => {
                setServerInfo(data.data);
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
                        serverInfo
                            ? `View information about ${serverInfo.user.username}'s server.`
                            : "Unknown Server"
                    }
                />
                <meta
                    property="twitter:description"
                    content={
                        serverInfo
                            ? `View information about ${serverInfo.user.username}'s server.`
                            : "Unknown Server"
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
                                        {serverInfo.name}{" "}
                                        {serverInfo.approved && (
                                            <GoVerified
                                                color="#fb8464"
                                                size={24}
                                            />
                                        )}
                                    </h1>
                                    <div className={styles.ownerAvatar}>
                                        <img src={serverInfo.user.avatar} />
                                        <Link
                                            href={`/users/${serverInfo.user.uuid}`}
                                        >
                                            {serverInfo.user.username}
                                        </Link>
                                    </div>
                                    <h2>IP: {serverInfo.address}</h2>
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
                                                margin: "10px 0",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    margin: "0 0 10px 0",
                                                    gap: "10px",
                                                }}
                                            >
                                                {voting ? (
                                                    <CircularProgress
                                                        size={39}
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="#0e0e0e"
                                                            iconColor="#fb8464"
                                                            icon={
                                                                <AiFillLike />
                                                            }
                                                            onClick={() =>
                                                                handleVote(true)
                                                            }
                                                            disabled={!captcha}
                                                        >
                                                            Upvote
                                                        </Button>
                                                        <Button
                                                            color="#0e0e0e"
                                                            iconColor="#fb8464"
                                                            icon={
                                                                <AiFillDislike />
                                                            }
                                                            onClick={() =>
                                                                handleVote(
                                                                    false
                                                                )
                                                            }
                                                            disabled={!captcha}
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
                                                        commentContent == "" ||
                                                        !captcha
                                                    }
                                                >
                                                    Post
                                                </Button>
                                            )}
                                            <div className={styles.recaptcha}>
                                                <Reaptcha
                                                    sitekey={
                                                        process.env
                                                            .NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                                                    }
                                                    onVerify={setCaptcha}
                                                    theme="dark"
                                                />
                                            </div>
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
                                    {[]
                                        .concat(serverInfo.comments)
                                        .sort((a, b) =>
                                            a.postedAt < b.postedAt ? 1 : -1
                                        )
                                        .map((comment, index) => (
                                            <Comment
                                                comment={comment}
                                                key={index}
                                            />
                                        ))}
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
