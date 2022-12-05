import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/system";
import styles from "./Loading.module.css";

const theme = createTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#FB8464",
            contrastText: "#fff",
        },
    },
});

const Loading = () => {
    return (
        <div className={styles.root}>
            <ThemeProvider theme={theme}>
                <CircularProgress />
                <h1>Loading...</h1>
            </ThemeProvider>
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
