import Head from "next/head";
import styles from "../styles/Home.module.css";
import { InnerLoading } from "../components/loading";
import { useEffect, useState } from "react";
import api from "../api";
import { useNotification } from "../components/notification";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("../components/navbar"));
const Server = dynamic(() => import("../components/server"));

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [serversInfo, setServersInfo] = useState(null);
    const notify = useNotification();
    useEffect(() => {
        api.getServers(0) // TODO: Get ?page param and pass it to api.getServers()
            .then((data) => {
                setServersInfo(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                notify({
                    type: "error",
                    content: "Failed to load servers.",
                });
            });
    }, []);

    return (
        <>
            <Head>
                <title>Eagler Server List | Home</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    property="og:description"
                    content="The brand new, rewritten Eaglercraft server list. Built from the ground up to be more secure and elegant."
                />
                <meta
                    property="twitter:description"
                    content="The brand new, rewritten Eaglercraft server list. Built from the ground up to be more secure and elegant."
                />
                <meta property="theme-color" content="#FB8464" />
                <meta property="og:title" content="Eagler Server List - Home" />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2230943795732741"
                    crossorigin="anonymous"
                ></script>
            </Head>
            <div>
                <Navbar />
                <div className={styles.homeRoot}>
                    <h1>Servers</h1>
                    <p>View a list of available servers.</p>
                    {loading ? (
                        <InnerLoading />
                    ) : (
                        <>
                            {serversInfo && serversInfo.length > 0 ? (
                                serversInfo.map((server, index) => (
                                    <Server server={server} key={index} />
                                ))
                            ) : (
                                <div className={styles.center}>
                                    <h1>Oops!</h1>
                                    <p>No servers found.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
