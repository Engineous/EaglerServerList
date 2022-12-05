import Head from "next/head";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import Button from "../../components/button";
import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Timestamp from "react-timestamp"
import api from "../../api";
import Link from "next/link";
import { MdOutlineReply } from "react-icons/md";
import { BiCommentAdd } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { style } from "@mui/system";

export default function ServerInfo() {
    const [serverInfo, setServerInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!user) router.push("/");
        api.getServer(id)
            .then((data) => {
                setServerInfo(data.data);
                api.getSpecificUser(data.data.owner).then((userData) => {
                    setUserInfo(userData.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                })
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
                        serverInfo ? serverInfo.description : "Unknown Server"
                    }
                />
                <meta
                    property="twitter:description"
                    content={
                        serverInfo ? serverInfo.description : "Unknown Server"
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
                    <CircularProgress />
                ) : (
                    <>
                        {serverInfo ? (
                            <>
                                <div className={styles.center}>
                                    <h1 className={styles.title}>{serverInfo.name}</h1>
                                    <p style={{ fontsize : "5px"}}>By: {loading ? <CircularProgress /> : userInfo ? userInfo.username : "Unknown User"}</p>
                                    <br />
                                    <p>IP: {serverInfo.address}</p>
                                    <p>{serverInfo.description}</p>
                                    <br />
                                </div>
                                <div className={styles.comments}>
                                    <div className={styles.commentInput}>
                                        <img style={{width:"40px", height:"auto"}} src={user.avatar} /><textarea id="commentContent" placeholder="Type a comment here..." className={styles.txtarea}></textarea>
                                        <Button id="commentBtn" color="#1e1e1e" icon={<BiCommentAdd/>} onClick={() => {api.submitForm(serverInfo.uuid, document.getElementById("commentContent").value)}}>Comment</Button>
                                    </div>
                                    {serverInfo.comments.map((comment, index) => (
                                        <>
                                            <div className={styles.box} key={index}>
                                                <div>
                                                    <p className={styles.poster}><img style={{width:"35px", height:"auto"}} src={comment.poster.avatar} />{comment.poster.username} <Timestamp style={{color:"#535353", marginLeft:"5px"}} relative date={comment.postedAt} /></p><br /> {/* TODO: Make username a link! */}
                                                </div>
                                                    <p className={styles.comment}>{comment.content}</p>
                                                </div>
                                            <br />
                                        </>
                                    ))}
                                    {serverInfo.comments.length < 1 && <p className={styles.center}>No comments</p>}
                                </div>
                            </>
                            
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100vw",
                                height: "calc(100vh - 60px)",
                            }}>
                                <h1>A server with this ID could not be found.</h1>
                                <Link href="/" style={{ color: "#fb8464" }}>Go Home?</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
