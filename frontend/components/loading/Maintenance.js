import { FaDiscord, FaWrench } from "react-icons/fa";
import styles from "./Loading.module.css";
import Button from "../button";

const Maintenance = () => {
    return (
        <div className={styles.root}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <FaWrench size={20} />
                <h1>
                    <b>Under Construction</b>
                </h1>
            </div>
            <p>The server list is currently under construction.</p>
            <Button
                icon={<FaDiscord size={24} />}
                color="#5865f2"
                href="https://discord.gg/jHM7FNASgV"
            >
                Join the Discord
            </Button>
        </div>
    );
};

export default Maintenance;
