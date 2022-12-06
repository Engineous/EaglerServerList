import Head from "next/head";
import styles from "/styles/Profile.module.css";
import Navbar from "../../components/navbar";
import { InnerLoading } from "../../components/loading";
import { useEffect, useState } from "react";
import { useUser } from "../../components/user";
import api from "../../api";
import Server from "../../components/server";
import Userbox from "../../components/userBox";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Profile() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [requestedUser, setRequestedUser] = useState(null);
    const { user } = useUser();
    
    useEffect(() => {
        api.getSpecificUser(id)
            .then((data) => {
                setRequestedUser(data.data);
                setLoading(false);
            }).catch((err) => {setLoading(false);})
    }, [user, requestedUser]);
    return (
        <>
            <Navbar />
            {loading ? (
                <>

                </>
            ):(
                <>
                    {user ? (
                        <>
                            {requestedUser ? (
                                <>
                                    <Userbox avatar={requestedUser.avatar} username={requestedUser.username} admin={requestedUser.admin} createdAt={requestedUser.admin} servers={requestedUser.servers} profile={false} />
                                </>
                            ):(
                                <>
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
                                    <h1>Oops!</h1>
                                    <p>
                                        Looks like this user doesnt exist... yet{" "}
                                        <Link href="/">
                                            <span>Go home?</span>
                                        </Link>
                                    </p>
                                </div>
                                </>
                            )}
                        </>
                    ):(
                        <>
                            <p className={styles.center}>Sorry, you are not logged in!</p> 
                        </>
                    )} 
                </>
            )}
        </>
    );
}