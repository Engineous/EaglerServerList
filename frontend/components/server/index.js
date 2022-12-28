import { useState } from "react";
import { useRouter } from "next/router";
import { GoVerified } from "react-icons/go";
import styles from "./Server.module.css";
import Button from "../../components/button";
import Timestamp from "react-timestamp";
import Modal from "../modal";
import { AiFillInfoCircle } from "react-icons/ai";

const Server = ({ server, motd, inline }) => {
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
            <h3
                style={{
                    color: "#aaa",
                }}
            >
                Votes:{" "}
                <span
                    style={{
                        color: `${server.votes > 0 ? "#46e393" : "#ff6565"}`,
                    }}
                >
                    {server.votes}
                </span>
            </h3>
            <h3>IP: {server.address}</h3>
            {motd}
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

const SetVoteModal = ({ ref, server }) => {
    const [votes, setVotes] = useState(server.votes);

    return (
        <Modal ref={ref} height="340px">
            <div className={styles.modalTitle}>
                <h1>Set Votes</h1>
            </div>
            <div className={styles.modalBody}>
                <p>test</p>
            </div>
        </Modal>
    );
};

export default Server;
