import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Loading.module.css";

const Loading = () => {
    return (
        <div className={styles.root}>
            <CircularProgress />
            <h1>Loading...</h1>
        </div>
    );
};

const InnerLoading = () => {
    return (
        <div className={styles.innerRoot}>
            <CircularProgress />
            <h1>Loading...</h1>
        </div>
    );
};

export { Loading, InnerLoading };
