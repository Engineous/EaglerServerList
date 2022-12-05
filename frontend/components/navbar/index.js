import { useUser } from "../user";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import Link from "next/link";
import Button from "../button";
import { FaDiscord } from "react-icons/fa";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import api from "../../api";

const Avatar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, setUser } = useUser();
    const router = useRouter();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div className={styles.avatar} onClick={handleClick}>
                <img src={user.avatar} />
                <h2>{user.username}</h2>
            </div>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={async () => {
                        handleClose();
                        await api.logout().catch(() => router.reload());
                        router.reload();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

const Navbar = () => {
    const { user } = useUser();
    const router = useRouter();
    const navElements = [
        {
            href: "/",
            name: "Home",
            icon: <HomeIcon />,
        },
    ];
    if (user)
        navElements.push({
            href: "/servers",
            name: "Your Servers",
            icon: <StorageIcon />,
        });

    return (
        <nav className={styles.root}>
            <div className={styles.logo}>
                <img src="/eagler.png" />
                <h1>Eagler Server List</h1>
            </div>
            <ul className={styles.navElements}>
                {navElements.map((navElement, index) => {
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
                <div style={{ margin: "0 10px 0 0" }}>
                    <Button
                        icon={<FaDiscord size={24} />}
                        color="#5865F2"
                        onClick={() =>
                            router.push(
                                `https://discord.com/oauth2/authorize?client_id=${
                                    process.env.NEXT_PUBLIC_CLIENT_ID
                                }&redirect_uri=${encodeURIComponent(
                                    process.env.NEXT_PUBLIC_REDIRECT_URI
                                )}&response_type=code&scope=identify`
                            )
                        }
                    >
                        Login with Discord
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
