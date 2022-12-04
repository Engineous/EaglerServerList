import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Navbar from "../../components/navbar";
import { useUser } from "../../components/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../api";

export default function ServerInfo() {
    const [serverInfo, setServerInfo] = useState(null);
    const { user } = useUser();
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!user) router.push("/");
        api.getServer(id).then((data) => {
            setServerInfo(data.data);
        }).catch(() => {});
        
    }, [user]);

    return (
        <>
            <Head>
                <title>Eagler Server List | {serverInfo ? serverInfo.name : "Unknown Server"}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    property="og:description"
                    content={serverInfo ? serverInfo.description : "Unknown Server"}
                />
                <meta
                    property="twitter:description"
                    content={serverInfo ? serverInfo.description : "Unknown Server"}
                />
                <meta property="theme-color" content="#FB8464" />
                <meta
                    property="og:title"
                    content={`Eagler Server List - ${serverInfo ? serverInfo.name : "Unknown Server"}`}
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.root}>
                <Navbar />
                {serverInfo ? (
                    <h1>{serverInfo.name}</h1>
                ) : (
                    <h1>A server with this ID could not be found.</h1>
                )}
            </div>
        </>
    );
}
