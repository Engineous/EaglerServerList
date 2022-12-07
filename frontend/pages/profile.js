import Head from "next/head";
import styles from "/styles/Profile.module.css";
import Navbar from "../components/navbar";
import { InnerLoading } from "../components/loading";
import { useEffect, useState } from "react";
import { useUser } from "../components/user";
import api from "../api";
import Server from "../components/server";
import Userbox from "../components/userBox";
import { useRouter } from "next/router";

export default function Profile() {
    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }),
        [user];
    return (
        <>
            <Navbar />
            {user ? (
                <>
                    <Userbox
                        username={user.username}
                        createdAt={user.createdAt}
                        avatar={user.avatar}
                        admin={user.admin}
                        servers={user.servers}
                        profile={true}
                    />
                </>
            ) : (
                <>
                    <p className={styles.center}>
                        Sorry, you are not logged in!
                    </p>
                </>
            )}
        </>
    );
}
