import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Navbar from "../../components/navbar";
import { useUser } from "../../components/user";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Servers() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push("/");
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
            <div className={styles.root}>
                <Navbar />
            </div>
        </>
    );
}
