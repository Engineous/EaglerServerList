import { useUser } from "../../components/user";
import { useState, useRef, forwardRef, useEffect } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { GoVerified } from "react-icons/go";
import { useNotification } from "../../components/notification";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./Server.module.css";
import Button from "../../components/button";
import CommentBox from "../../components/commentBox";
import Comment from "../../components/comment";
import api from "../../api";
import Reaptcha from "reaptcha";
import Card from "../../components/card";
import Timestamp from "react-timestamp";
import Badge from "../../components/badge";
import Modal from "../modal";
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
    MdEdit,
} from "react-icons/md";
import {
    IoMdThumbsUp,
    IoMdThumbsDown,
    IoIosCheckmarkCircle,
} from "react-icons/io";
import { GiStoneBlock, GiSwordsEmblem } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Input from "../input";
import RichInput from "../input/richInput";
import { BiRename } from "react-icons/bi";
import CodeBox from "../codeBox";
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

const ServerInfo = ({ server: serverInfo, analytics }) => {
    const [commentContent, setCommentContent] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [voteCaptcha, setVoteCaptcha] = useState(null);
    const [commentCaptcha, setCommentCaptcha] = useState(null);
    const [voteValue, setVoteValue] = useState(null);
    const [voting, setVoting] = useState(false);
    const [server, setServerInfo] = useState(serverInfo);

    // Admin action stuff
    const [updating, setUpdating] = useState(false);
    const [votes, setVotes] = useState(server.votes);

    // Edit server
    const [name, setName] = useState(server.name);
    const [description, setDescription] = useState(server.description);

    // Server verification stuff
    const [verifyCaptcha, setVerifyCaptcha] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const { user } = useUser();
    const router = useRouter();
    const notify = useNotification();

    const setVotesRef = useRef();
    const editServerRef = useRef();
    const verifyRef = useRef();

    const postComment = async (captcha) => {
        commentCaptcha.reset();
        setPostingComment(true);

        try {
            const data = await api.postComment({
                uuid: server.uuid,
                content: commentContent,
                captcha,
            });
            if (data.success) {
                setServerInfo({
                    ...serverInfo,
                    comments: [...server.comments, data.data],
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
    const handleVote = async (captcha) => {
        setVoteValue(null);
        voteCaptcha.reset();
        setVoting(true);
        try {
            const data = await api.vote({
                id: server.uuid,
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
    const handleEdit = async () => {
        setUpdating(true);

        try {
            const { success, data } = await api.updateServer({
                id: serverInfo.uuid,
                name,
                description,
            });
            if (success) {
                setServerInfo({
                    ...serverInfo,
                    name: data.name,
                    description: data.description,
                });
                notify({
                    type: "success",
                    content: "Successfully updated the server.",
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
        setUpdating(false);
        editServerRef.current.close();
    };
    const updateVotes = async () => {
        setUpdating(true);

        try {
            const data = await api.adminUpdateServer({
                id: serverInfo.uuid,
                votes,
            });
            if (data.success) {
                setServerInfo({
                    ...serverInfo,
                    votes,
                });
                notify({
                    type: "success",
                    content: "Successfully updated the votes for this server.",
                });
            }
        } catch (err) {
            console.log(err);
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
        setUpdating(false);
        setVotesRef.current.close();
    };
    const verifyServer = async (captcha) => {
        setVerifying(true);

        try {
            const data = await api.verifyServer({
                uuid: serverInfo.uuid,
                captcha,
            });
            if (data.success) {
                setServerInfo({
                    ...serverInfo,
                    verified: true,
                });
                notify({
                    type: "success",
                    content: "Successfully verified the server.",
                });
                setVerifying(false);
                verifyRef.current.close();
            }
        } catch (err) {
            setVerifying(false);
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
    };
    useEffect(() => {
        if (!server.verified && user && user.uuid == server.user.uuid) verifyRef.current.open();
    }, [server]);
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    const pcOptions = {
        responsive: true,
    };

    return (
        <>
            <Modal ref={editServerRef} title="Edit Server" height="275px">
                <p
                    style={{
                        color: "#757575",
                    }}
                >
                    Edit your server information.
                </p>
                <Input
                    value={name}
                    startIcon={<BiRename />}
                    placeholder="Please enter a server name"
                    onChange={setName}
                />
                <RichInput
                    value={description}
                    startIcon={<MdDescription />}
                    placeholder="Please enter a description"
                    onChange={setDescription}
                />
                {updating ? (
                    <CircularProgress />
                ) : (
                    <Button
                        icon={<MdEdit />}
                        iconColor="#fb8464"
                        color="#101010"
                        disabled={!name && !description}
                        onClick={handleEdit}
                    >
                        Submit Changes
                    </Button>
                )}
            </Modal>
            <Modal ref={setVotesRef} title="Set Votes" height="175px">
                <p
                    style={{
                        color: "#757575",
                    }}
                >
                    Override the votes for {server.name}
                </p>
                <Input
                    placeholder="Vote amount..."
                    value={votes}
                    type="text"
                    onChange={setVotes}
                    startIcon={<MdInsertChart />}
                />
                {updating ? (
                    <CircularProgress />
                ) : (
                    <Button
                        color="#101010"
                        iconColor="#ff6565"
                        icon={<MdInsertChart />}
                        onClick={updateVotes}
                    >
                        Set Votes
                    </Button>
                )}
            </Modal>
            <Modal
                ref={verifyRef}
                title="Verification Required"
                height="220px"
                forced
            >
                <p>This server requires verification.</p>
                <CodeBox>confirm-code {serverInfo.code}</CodeBox>
                <p>
                    Please enter this command into your Bungee console, then
                    click Verify.
                </p>
                {verifying ? (
                    <CircularProgress />
                ) : (
                    <>
                        {" "}
                        <Button
                            icon={<IoIosCheckmarkCircle />}
                            color="#fb8464"
                            onClick={(event) => {
                                event.preventDefault();
                                verifyCaptcha.execute();
                            }}
                        >
                            Verify
                        </Button>
                        <Reaptcha
                            ref={(e) => {
                                setVerifyCaptcha(e);
                            }}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onVerify={(res) => verifyServer(res)}
                            theme="dark"
                            size="invisible"
                        />
                    </>
                )}
            </Modal>
            {/* <SetVoteModal ref={setVotesRef} server={server} /> */}
            <div className={styles.flexCenter}>
                <h1>
                    {server.name}{" "}
                    {server.approved && (
                        <GoVerified color="#fb8464" size={28} />
                    )}
                </h1>
                <div className={styles.ownerAvatar}>
                    <img src={server.user.avatar} />
                    <Link href={`/users/${server.user.uuid}`}>
                        {server.user.username}
                    </Link>
                </div>
                <h3>
                    Created at <Timestamp date={server.createdAt} />
                </h3>
                {server.redirected && <h3>Verification needed!!!</h3>}
                <div className={styles.badgeContainer}>
                    {server.tags.map((tag, index) => (
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
                <Card icon={<FaServer />} text="Server Info">
                    <div
                        className={styles.flexRow}
                        style={{
                            gap: "25px",
                            alignItems: "stretch",
                        }}
                    >
                        <div className={styles.flexColumn}>
                            <h3>Address</h3>
                            <p>
                                <span
                                    style={{
                                        fontWeight: "600",
                                    }}
                                >
                                    {server.address}
                                </span>
                            </p>
                        </div>
                        <div className={styles.flexColumn}>
                            <h3>Discord Server</h3>
                            {server.discord ? (
                                <Button
                                    icon={<FaDiscord />}
                                    color="#5865F2"
                                    onClick={() =>
                                        router.push(
                                            `https://discord.gg/${server.discord}`
                                        )
                                    }
                                >
                                    Join Discord
                                </Button>
                            ) : (
                                <p
                                    style={{
                                        color: "#ff6565",
                                    }}
                                >
                                    This server has not provided a Discord
                                    invite.
                                </p>
                            )}
                        </div>
                        {(user && user.admin) ||
                            (user && user.uuid == server.user.uuid && (
                                <div className={styles.flexColumn}>
                                    <h3>Edit</h3>
                                    <Button
                                        icon={<MdEdit />}
                                        color="#202020"
                                        iconColor="#fb8464"
                                        onClick={() =>
                                            editServerRef.current.open()
                                        }
                                    >
                                        Edit Server
                                    </Button>
                                </div>
                            ))}
                    </div>
                </Card>
                <Card icon={<MdInsertChart />} text="Votes">
                    <p>
                        This server has{" "}
                        <span
                            style={{
                                color: `${
                                    server.votes > 0 ? "#46e393" : "#ff6565"
                                }`,
                            }}
                        >
                            {server.votes}
                        </span>{" "}
                        votes.
                    </p>
                    <div
                        className={styles.flexRow}
                        style={{
                            gap: "10px",
                        }}
                    >
                        {user ? (
                            voting ? (
                                <CircularProgress size={36} />
                            ) : (
                                <>
                                    <Button
                                        color="#202020"
                                        iconColor="#fb8464"
                                        icon={<IoMdThumbsUp />}
                                        onClick={() => {
                                            setVoteValue(true);
                                            voteCaptcha.execute();
                                        }}
                                    >
                                        Nice!
                                    </Button>
                                    <Button
                                        color="#202020"
                                        iconColor="#fb8464"
                                        icon={<IoMdThumbsDown />}
                                        onClick={() => {
                                            setVoteValue(false);
                                            voteCaptcha.execute();
                                        }}
                                    >
                                        Sh*t!
                                    </Button>
                                    <Reaptcha
                                        ref={(e) => {
                                            setVoteCaptcha(e);
                                        }}
                                        sitekey={
                                            process.env
                                                .NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                                        }
                                        onVerify={(res) => handleVote(res)}
                                        theme="dark"
                                        size="invisible"
                                    />
                                </>
                            )
                        ) : (
                            <p style={{ color: "#ff6565" }}>
                                You must login to be able to vote.
                            </p>
                        )}
                    </div>
                </Card>
                {user && user.admin && (
                    <Card icon={<MdShield />} text="Admin Actions">
                        <div
                            className={styles.flexRow}
                            style={{
                                flexWrap: "wrap",
                                gap: "10px",
                            }}
                        >
                            <Button
                                icon={<MdInsertChart />}
                                iconColor="#ff6565"
                                color="#202020"
                                onClick={() => setVotesRef.current.open()}
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
                <Card icon={<MdDescription />} text="Description">
                    <ReactMarkdown>{server.description}</ReactMarkdown>
                </Card>
            </div>
            <div className={styles.cardsRow}>
                <Card icon={<MdAnalytics />} text="Analytics">
                    {analytics ? (
                        <div className={styles.flexRow}>
                            <div
                                className={styles.flexColumn}
                                style={{ width: "100%" }}
                            >
                                <h3>Player Count</h3>
                                <Line options={pcOptions} data={analytics.pc} />
                            </div>
                            <div
                                className={styles.flexColumn}
                                style={{ width: "100%" }}
                            >
                                <h3>Uptime</h3>
                                <Line
                                    options={pcOptions}
                                    data={analytics.uptime}
                                />
                            </div>
                        </div>
                    ) : (
                        <p>
                            No server analytics have been found for this server.
                        </p>
                    )}
                </Card>
            </div>
            <div className={styles.cardsRow}>
                <Card icon={<FaCommentAlt />} text="Comments">
                    {user ? (
                        <>
                            <CommentBox
                                avatar={user.avatar}
                                onChange={setCommentContent}
                                value={commentContent}
                                onClick={(event) => {
                                    event.preventDefault();
                                    commentCaptcha.execute();
                                }}
                                disabled={commentContent == ""}
                                loading={postingComment}
                            />
                            <Reaptcha
                                ref={(e) => {
                                    setCommentCaptcha(e);
                                }}
                                sitekey={
                                    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                                }
                                onVerify={(res) => postComment(res)}
                                theme="dark"
                                size="invisible"
                            />
                        </>
                    ) : (
                        <p style={{ color: "#ff6565" }}>
                            You must login to be able to post comments.
                        </p>
                    )}
                    {[]
                        .concat(server.comments)
                        .sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1))
                        .map((comment, index) => (
                            <Comment comment={comment} key={index} inline />
                        ))}
                </Card>
            </div>
        </>
    );
};

export default ServerInfo;
