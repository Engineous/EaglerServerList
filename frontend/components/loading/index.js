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
    )
}

export default Loading;
