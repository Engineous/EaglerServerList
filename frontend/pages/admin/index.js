import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Navbar from "../../components/navbar";
import { useUser } from "../../components/user";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Admin = () => {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) return router.push("/");

        if (!user.admin) return router.push("/");
    });

    return (
        <>
            <Head>
                <title>Eagler Server List | Admin Panel</title>
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
                    content="Eagler Server List - Admin Panel"
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <Navbar />
                <div className={styles.homeRoot}>
                    <h1>Admin Panel</h1>
                    <p>Under Construction</p>
                </div>
            </div>
        </>
    );
};

export default Admin;
