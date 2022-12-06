import { ThemeProvider } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import { createTheme } from "@mui/system";
import { defaultConfig } from "next/dist/server/config-shared";
import Timestamp from "react-timestamp";
import styles from "./Userbox.module.css";

const ServersBox = ({ servers, profile }) => {
    return (
        <div className={styles.ownedServersBox} style={{padding:"20px", margin:"20px", borderRadius:"20px"}}>
            <h2>Owned Servers</h2><br />
            {profile ? (
                <>
                    {servers ? (
                    <div className={styles.servers}>
                        {servers.map((server, index) => (
                            <div key={index}>
                                <h3>{server.name} - {server.address}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no servers...yet</p>
                )}
                </>
            ):(
                <>
                    {servers ? (
                    <div className={styles.servers}>
                        {servers.map((server, index) => (
                            <div key={index}>
                                <h3>{server.name} - {server.address}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>This user has no servers...yet</p>
                )}
                </>
            )}
        </div>
    );
};
const InfoBox = ({ username, createdAt, avatar, admin }) => {
    return (
        <div className={styles.row}>
            <div className={styles.box} style={{padding:"20px", margin:"20px", borderRadius:"20px"}}>
                <div className={styles.avatar}>
                    <img src={avatar} />
                </div>
                <div>
                    <h2>{username} {admin && <span>[Admin]</span>}</h2>
                    <p className={styles.joinedAt}>Joined: <Timestamp date={createdAt} /></p>
                </div>
            </div>
        </div>
    );
};
const Userbox = ({ avatar, username, admin, createdAt, servers, profile }) => {
    return (
        <div className={styles.toprow}>
            <InfoBox username={username} createdAt={createdAt} avatar={avatar} admin={admin} />
            <ServersBox servers={servers}  profile={profile}/>
        </div>
    );
};
export default Userbox;