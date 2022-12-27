import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { InnerLoading } from "../../components/loading";
import { ServerInfo } from "../../components/server";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import api from "../../api";
import Link from "next/link";
import moment from "moment";

export default function Server() {
    const [serverInfo, setServerInfo] = useState(null);
    const [serverAnalytics, setServerAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        api.getServer(id)
            .then((data) => {
                setServerInfo(data.data);
                api.getAnalytics(id)
                    .then(async ({ data }) => {
                        const analytics = {
                            playerCount: {
                                labels: [],
                                data: [],
                            },
                            uptime: {
                                labels: [],
                                data: [],
                            },
                        };
                        const pcData = {
                            labels: [],
                            datasets: [
                                {
                                    label: "Player Count",
                                    data: [],
                                    backgroundColor: "rgb(251, 132, 100)",
                                    borderColor: "rgb(251, 132, 100)",
                                },
                            ],
                        };
                        const uptimeData = {
                            labels: [],
                            datasets: [
                                {
                                    label: "Uptime",
                                    data: [],
                                    backgroundColor: "rgb(251, 132, 100)",
                                    borderColor: "rgb(251, 132, 100)",
                                },
                            ],
                        };
                        await Promise.all(
                            data.playerCount.map((stat) => {
                                pcData.datasets[0].data.push(stat.playerCount);
                                pcData.labels.push(
                                    moment(stat.createdAt).format("HH:mm")
                                );
                            }),
                            data.uptime.map((stat) => {
                                uptimeData.datasets[0].data.push(stat.up);
                                uptimeData.labels.push(
                                    moment(stat.createdAt).format("HH:mm")
                                );
                            })
                        );
                        setServerAnalytics({ pc: pcData, uptime: uptimeData });
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
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
                            <ServerInfo
                                server={serverInfo}
                                analytics={serverAnalytics}
                            />
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
