import styles from "/styles/Profile.module.css";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { useUser } from "../components/user";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Userbox = dynamic(() => import("../components/userBox"));

export default function Profile() {
    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    });
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
