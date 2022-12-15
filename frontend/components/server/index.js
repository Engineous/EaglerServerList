import { GoVerified } from "react-icons/go";
import { AiFillInfoCircle } from "react-icons/ai";
import Button from "../button";
import { useRouter } from "next/router";
import styles from "./Server.module.css";
import Timestamp from "react-timestamp";

const Server = ({ server, inline }) => {
    const router = useRouter();

    return inline ? (
        <div className={styles.inlineBox}>
            <h2>
                {server.name}{" "}
                {server.approved && <GoVerified color="#fb8464" />}
            </h2>
            <h3>
                <Timestamp date={server.createdAt} autoUpdate />
            </h3>
            <Button
                color="#1e1e1e"
                icon={<AiFillInfoCircle color="#fb8464" />}
                onClick={() => router.push(`/servers/${server.uuid}`)}
            >
                More Info
            </Button>
        </div>
    ) : (
        <div className={styles.box}>
            <h2>
                {server.name}{" "}
                {server.approved && <GoVerified color="#fb8464" />}
            </h2>
            <h3>IP: {server.address}</h3>
            <p>(PLACEHOLDER MOTD)</p>
            <div className={styles.buttonContainer}>
                <Button
                    color="#202020"
                    icon={<AiFillInfoCircle color="#fb8464" />}
                    onClick={() => router.push(`/servers/${server.uuid}`)}
                >
                    More Info
                </Button>
            </div>
        </div>
    );
};

export default Server;
