import { useUser } from "../user";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

const Navbar = (props) => {
    const { user } = useUser();
    const router = useRouter();
    return (
        <nav className={styles.root}>
            <h1>Eagler Server List</h1>
        </nav>
    )
}

export default Navbar;
