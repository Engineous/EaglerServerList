import { useEffect, useState } from "react";
import { useUser } from "../../components/user";
import Head from "next/head";
import styles from "/styles/Profile.module.css";
import { InnerLoading } from "../../components/loading";
import api from "../../api";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import Button from "../../components/button";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("../../components/navbar"));
const Userbox = dynamic(() => import("../../components/userBox"));

export default function Profile() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        api.getSpecificUser(id)
            .then((data) => {
                setUserData(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);
    return (
        <>
            <Head>
                {user ? (
                    <title>
                        Eagler Server List |{" "}
                        {userData ? userData.username : "Unknown User"}
                    </title>
                ) : (
                    <title>Eagler Server List | Not Authorized</title>
                )}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    property="og:description"
                    content={
                        userData
                            ? `View ${userData.username}'s profile.`
                            : "Unknown User"
                    }
                />
                <meta
                    property="twitter:description"
                    content={
                        userData
                            ? `View ${userData.username}'s profile.`
                            : "Unknown User"
                    }
                />
                <meta property="theme-color" content="#FB8464" />
                <meta
                    property="og:title"
                    content={`Eagler Server List - ${
                        userData ? userData.username : "Unknown User"
                    }`}
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2230943795732741"
                    crossorigin="anonymous"
                ></script>
            </Head>
            <div className={styles.root}>
                <Navbar />
                {loading ? (
                    <InnerLoading />
                ) : (
                    <>
                        {user ? (
                            <>
                                {userData ? (
                                    <>
                                        <Userbox user={userData} />
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className={styles.center}
                                            style={{
                                                width: "100vw",
                                                height: "calc(100vh - 60px)",
                                            }}
                                        >
                                            <h1>Oops!</h1>
                                            <p>
                                                Looks like this user doesn't
                                                exist.{" "}
                                                <Link href="/">
                                                    <span>Go home?</span>
                                                </Link>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div
                                className={styles.center}
                                style={{
                                    width: "100vw",
                                    height: "calc(100vh - 60px)",
                                }}
                            >
                                <h1>Oops!</h1>
                                <p>
                                    You must be logged in to perform this
                                    action.
                                </p>
                                <div style={{ margin: "5px 0" }} />
                                <Button
                                    icon={<FaDiscord size={24} />}
                                    color="#5865F2"
                                    onClick={() =>
                                        router.push(
                                            `https://discord.com/oauth2/authorize?client_id=${
                                                process.env
                                                    .NEXT_PUBLIC_CLIENT_ID
                                            }&redirect_uri=${encodeURIComponent(
                                                process.env
                                                    .NEXT_PUBLIC_REDIRECT_URI
                                            )}&response_type=code&scope=identify`
                                        )
                                    }
                                >
                                    Login with Discord
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
