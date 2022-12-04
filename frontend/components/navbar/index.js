import { useUser } from "../user";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import HomeIcon from '@mui/icons-material/Home';
import StorageIcon from '@mui/icons-material/Storage';
import Link from "next/link";

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
                            <li className={styles.active} onClick={() => router.push(navElement.href)} key={index}>
                                {navElement.icon}
                                <Link href={navElement.href}>{navElement.name}</Link>
                            </li>
                        );
                    return (
                        <li onClick={() => router.push(navElement.href)} key={index}>
                            {navElement.icon}
                            <Link href={navElement.href}>{navElement.name}</Link>
                        </li>
                    )
                })}
            </ul>
            {user && (
                <div className={styles.avatar}>
                    <img src={user.avatar} />
                    <h2>{user.username}</h2>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
