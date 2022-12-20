import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import { InnerLoading } from "../../components/loading";
import { GoVerified } from "react-icons/go";
import { useNotification } from "../../components/notification";
import Head from "next/head";
import dynamic from "next/dynamic";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import Button from "../../components/button";
import CommentBox from "../../components/commentBox";
import Comment from "../../components/comment";
import api from "../../api";
import Link from "next/link";
import Reaptcha from "reaptcha";
import Card from "../../components/card";
import { GiStoneBlock, GiSwordsEmblem } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import Timestamp from "react-timestamp";
import Badge from "../../components/badge";
import {
    FaCommentAlt,
    FaCommentSlash,
    FaDiscord,
    FaGamepad,
    FaQuestion,
    FaServer,
    FaSkull,
    FaTools,
    FaUserCog,
    FaUserFriends,
} from "react-icons/fa";
import {
    MdGames,
    MdFastfood,
    MdInsertChart,
    MdLocalPolice,
    MdShield,
    MdVisibilityOff,
    MdDescription,
    MdAnalytics,
} from "react-icons/md";
const ReactMarkdown = dynamic(() => import("react-markdown"));

const badges = {
    PVP: {
        color: "#ff6565",
        icon: <GiSwordsEmblem />,
    },
    PVE: {
        color: "#ff6565",
        icon: <FaSkull />,
    },
    FACTIONS: {
        color: "#ff6565",
        icon: <RiTeamFill />,
    },
    MINIGAMES: {
        color: "#f7ff65",
        icon: <MdGames />,
    },
    SURVIVAL: {
        color: "#46e393",
        icon: <MdFastfood />,
    },
    CREATIVE: {
        color: "#46e393",
        icon: <FaTools />,
    },
    SKYBLOCK: {
        color: "#46e393",
        icon: <GiStoneBlock />,
    },
    PRISON: {
        color: "#ff6565",
        icon: <MdLocalPolice />,
    },
    RPG: {
        color: "#ff6565",
        icon: <FaGamepad />,
    },
    MISCELLANEOUS: {
        color: "#46e393",
        icon: <FaQuestion />,
    },
};

export default function ServerInfo() {
    const [serverInfo, setServerInfo] = useState(null);
    const [commentContent, setCommentContent] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [voteCaptcha, setVoteCaptcha] = useState(null);
    const [commentCaptcha, setCommentCaptcha] = useState(null);
    const [voteValue, setVoteValue] = useState(null);
    const [voting, setVoting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [serverAnalytics, setServerAnalytics] = useState(null);
    const { user } = useUser();
    const router = useRouter();
    const notify = useNotification();
    const { id } = router.query;

    const postComment = async (captcha) => {
        commentCaptcha.reset();
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
            if (err.response && err.response.status == 429) {
                const retryAfter = err.response.headers["retry-after"];
                notify({
                    type: "error",
                    content: `You are being rate limited.${
                        retryAfter
                            ? ` Please retry after ${retryAfter} seconds.`
                            : ""
                    }`,
                });
            } else if (
                !err.response ||
                !err.response.data ||
                !err.response.data.message
            )
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
    const PlayerTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className={styles.ToolTip}>
                <p>{`${payload[0].value} Players`}</p>
            </div>
          );
        }
      
        return null;
      };
    const handleVote = async (captcha) => {
        setVoteValue(null);
        voteCaptcha.reset();
        setVoting(true);
        try {
            const data = await api.vote({
                id: serverInfo.uuid,
                value: voteValue,
                captcha,
            });
            if (data.success) {
                setServerInfo({
                    ...serverInfo,
                    votes: data.data.votes,
                });
                notify({
                    type: "success",
                    content: "Successfully voted for this server.",
                });
            }
        } catch (err) {
            if (err.response && err.response.status == 429) {
                const retryAfter = err.response.headers["retry-after"];
                notify({
                    type: "error",
                    content: `You are being rate limited.${
                        retryAfter
                            ? ` Please retry after ${retryAfter} seconds.`
                            : ""
                    }`,
                });
            } else if (
                !err.response ||
                !err.response.data ||
                !err.response.data.message
            )
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
        setVoting(false);
    };

    useEffect(() => {
        api.getServer(id)
            .then((data) => {
                setServerInfo(data.data);
                api.getAnalytics(id).then((data) => {
                    setServerAnalytics(data.data);
                    setLoading(false);
                });
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
                                {/* <div className={styles.center}>
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
                                </div> */}
                                <div className={styles.flexCenter}>
                                    <h1>
                                        {serverInfo.name}{" "}
                                        {serverInfo.approved && (
                                            <GoVerified
                                                color="#fb8464"
                                                size={28}
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
                                    <h3>
                                        Created at{" "}
                                        <Timestamp
                                            date={
                                                serverInfo.createdAt
                                            }
                                        />
                                    </h3>
                                    <div className={styles.badgeContainer}>
                                        {serverInfo.tags.map((tag, index) => (
                                            <Badge
                                                icon={badges[tag].icon}
                                                color={badges[tag].color}
                                                key={index}
                                                inline
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardsRow}>
                                    <Card
                                        icon={<FaServer />}
                                        text="Server Info"
                                    >
                                        <div className={styles.flexRow} style={{
                                            gap: "25px",
                                        }}>
                                            <div className={styles.flexColumn}>
                                                <h3>Address</h3>
                                                <p>
                                                    <span
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {serverInfo.address}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className={styles.flexColumn}>
                                                <h3>Discord Server</h3>
                                                <Button
                                                    icon={<FaDiscord />}
                                                    color="#5865F2"
                                                >
                                                    Join Discord
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card icon={<MdInsertChart />} text="Votes">
                                        <p>
                                            This server has{" "}
                                            <span
                                                style={{
                                                    color: `${
                                                        serverInfo.votes > 0
                                                            ? "#46e393"
                                                            : "#ff6565"
                                                    }`,
                                                }}
                                            >
                                                {serverInfo.votes}
                                            </span>{" "}
                                            votes.
                                        </p>
                                        <div className={styles.flexRow} style={{
                                            gap: "10px",
                                        }}>
                                            {user ? (
                                                voting ? (
                                                    <CircularProgress
                                                        size={36}
                                                    />
                                                ) : (
                                                    <>
                                                        <Button
                                                            color="#202020"
                                                            iconColor="#fb8464"
                                                            icon={
                                                                <IoMdThumbsUp />
                                                            }
                                                            onClick={() => {
                                                                setVoteValue(
                                                                    true
                                                                );
                                                                voteCaptcha.execute();
                                                            }}
                                                        >
                                                            Nice!
                                                        </Button>
                                                        <Button
                                                            color="#202020"
                                                            iconColor="#fb8464"
                                                            icon={
                                                                <IoMdThumbsDown />
                                                            }
                                                            onClick={() => {
                                                                setVoteValue(
                                                                    false
                                                                );
                                                                voteCaptcha.execute();
                                                            }}
                                                        >
                                                            Sh*t!
                                                        </Button>
                                                        <Reaptcha
                                                            ref={(e) => {
                                                                setVoteCaptcha(
                                                                    e
                                                                );
                                                            }}
                                                            sitekey={
                                                                process.env
                                                                    .NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                                                            }
                                                            onVerify={(res) =>
                                                                handleVote(res)
                                                            }
                                                            theme="dark"
                                                            size="invisible"
                                                        />
                                                    </>
                                                )
                                            ) : (
                                                <p style={{ color: "#ff6565" }}>
                                                    You must login to be able to
                                                    vote.
                                                </p>
                                            )}
                                        </div>
                                    </Card>
                                    {user && user.admin && (
                                        <Card
                                            icon={<MdShield />}
                                            text="Admin Actions"
                                        >
                                            <div className={styles.flexRow} style={{
                                                flexWrap: "wrap",
                                                gap: "10px",
                                            }}>
                                                <Button
                                                    icon={<MdInsertChart />}
                                                    iconColor="#ff6565"
                                                    color="#202020"
                                                >
                                                    Set Votes
                                                </Button>
                                                <Button
                                                    icon={<MdVisibilityOff />}
                                                    iconColor="#ff6565"
                                                    color="#202020"
                                                >
                                                    Disable Server
                                                </Button>
                                                <Button
                                                    icon={<FaCommentSlash />}
                                                    iconColor="#ff6565"
                                                    color="#202020"
                                                >
                                                    Clear Comments
                                                </Button>
                                                <Button
                                                    icon={<FaUserCog />}
                                                    iconColor="#ff6565"
                                                    color="#202020"
                                                >
                                                    Owner Override
                                                </Button>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                                <div className={styles.cardsRow}>
                                    <Card
                                        icon={<MdDescription />}
                                        text="Description"
                                    >
                                        <ReactMarkdown>
                                            {serverInfo.description}
                                        </ReactMarkdown>
                                    </Card>
                                </div>
                                <div className={styles.cardsRow}>
                                    <Card
                                        icon={<MdAnalytics />}
                                        text="Analytics"
                                    >
                                        <p>To be implemented</p>
                                    </Card>
                                </div>
                                <div className={styles.cardsRow}>
                                    <Card
                                        icon={<FaUserFriends />}
                                        text="Player Count"
                                    >
                                        <ResponsiveContainer width="100%" height={350}>
                                            <LineChart data={serverAnalytics.PlayerCount} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                <Line type="monotone" dataKey="Player Count" stroke="#fb8464" />
                                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                                <XAxis dataKey="createdAt" />
                                                <YAxis />
                                                <Tooltip content={<PlayerTooltip />} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </div>
                                <div className={styles.cardsRow}>
                                    <Card
                                        icon={<FaCommentAlt />}
                                        text="Comments"
                                    >
                                        {user ? (
                                            <>
                                                <CommentBox
                                                    avatar={user.avatar}
                                                    onChange={setCommentContent}
                                                    value={commentContent}
                                                    onClick={() => {
                                                        commentCaptcha.execute();
                                                    }}
                                                    disabled={
                                                        commentContent == ""
                                                    }
                                                    loading={postingComment}
                                                />
                                                <Reaptcha
                                                    ref={(e) => {
                                                        setCommentCaptcha(e);
                                                    }}
                                                    sitekey={
                                                        process.env
                                                            .NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                                                    }
                                                    onVerify={(res) =>
                                                        postComment(res)
                                                    }
                                                    theme="dark"
                                                    size="invisible"
                                                />
                                            </>
                                        ) : (
                                            <p style={{ color: "#ff6565" }}>
                                                You must login to be able to
                                                post comments.
                                            </p>
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
                                                    inline
                                                />
                                            ))}
                                    </Card>
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
