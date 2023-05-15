import { useUser } from "../user";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Button from "../button";
import { FaDiscord, FaHome, FaServer } from "react-icons/fa";
import { MdArrowForward, MdShield } from "react-icons/md";
import api from "../../api";
import Badge from "../badge";

const Avatar = () => {
    const { user } = useUser();
    const router = useRouter();

    const handleLogout = () =>
        api.logout().then(router.reload).catch(router.reload);

    return (
        <div className={styles.avatarContainer}>
            <div
                className={styles.avatar}
                onClick={() => {
                    router
                        .push("/")
                        .then(() => router.push(`/users/${user.uuid}`));
                }}
            >
                <img src={user.avatar} />
                <p>{user.username}</p>
            </div>
            <button className={styles.button} onClick={handleLogout}>
                <MdArrowForward color="#ff6565" />
            </button>
        </div>
    );
};

const Navbar = () => {
    const { user } = useUser();
    const router = useRouter();
    const navElements = [
        {
            href: "/",
            name: "Home",
            icon: <FaHome color="#fb8464" />,
            visible: true,
        },
        {
            href: "/servers",
            name: "Your Servers",
            icon: <FaServer color="#fb8464" />,
            visible: user != null,
        },
        {
            href: "/admin",
            name: "Admin Panel",
            icon: <MdShield color="#ff6565" />,
            visible: user && user.admin,
        },
    ];

    return (
        <nav className={styles.root}>
            <div className={styles.logo}>
                <img src="/eagler.png" />
                <h1>Eagler Server List</h1>
                <Badge color="#fb8464" inline>
                    BETA
                </Badge>
            </div>
            <div className={styles.spacer} />
            <ul className={styles.navElements}>
                {navElements.map((navElement, index) => {
                    if (!navElement.visible) return;
                    if (router.pathname == navElement.href)
                        return (
                            <li
                                className={styles.active}
                                onClick={() => router.push(navElement.href)}
                                key={index}
                            >
                                {navElement.icon}
                                <Link href={navElement.href}>
                                    {navElement.name}
                                </Link>
                            </li>
                        );
                    return (
                        <li
                            onClick={() => router.push(navElement.href)}
                            key={index}
                        >
                            {navElement.icon}
                            <Link href={navElement.href}>
                                {navElement.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            {user ? (
                <Avatar />
            ) : (
                <div style={{ margin: "0 30px 0 0" }}>
                    <Button
                        icon={<FaDiscord size={24} />}
                        color="#5865F2"
                        href={`https://discord.com/oauth2/authorize?client_id=${
                            process.env.NEXT_PUBLIC_CLIENT_ID
                        }&redirect_uri=${encodeURIComponent(
                            process.env.NEXT_PUBLIC_REDIRECT_URI
                        )}&response_type=code&scope=identify`}
                    >
                        Login with Discord
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
