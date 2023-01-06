import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Navbar from "../../components/navbar";
import { useUser } from "../../components/user";
import { useEffect } from "react";
import UserServer from "../../components/serverUser";
import Button from "../../components/button";
import { InnerLoading } from "../../components/loading";
import { useNotification } from "../../components/notification";
import api from "../../api";
import { useState } from "react";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";

export default function Servers() {
    const { user } = useUser();
    const router = useRouter();
    const [serversInfo, setServersInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const notify = useNotification();

    useEffect(() => {
        if (!user) router.push("/");
        api.getUserServers()
            .then((data) => {
                setServersInfo(data.data);
                console.log(data)
                setLoading(false);
            })
            .catch((err) => {
                notify({
                    type: "error",
                    content: "Failed to load servers.",
                });
                console.log(err)
                setLoading(false);
            });

    }, [user]);

    return (
        <>
            <Head>
                <title>Eagler Server List | Your Servers</title>
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
                <meta
                    property="og:title"
                    content="Eagler Server List - Your Servers"
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Navbar />
                <div className={styles.homeRoot}>
                    <h1 className={styles.row}>
                        Your Servers
                        <Button style={{marginLeft:"5px"}} icon={<MdAdd />} color="#fb8464" onClick={() => router.push("/servers/new")}>New</Button>
                    </h1>
                    <p>Manage the servers that you own.</p>
                    {loading ? (
                        <InnerLoading />
                    ) : (
                        <>
                            {serversInfo && serversInfo.length > 0 ? (
                                serversInfo.map((server, index) => (
                                    <UserServer server={server} key={index} />
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
