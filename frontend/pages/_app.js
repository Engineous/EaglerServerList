import { useEffect, useState } from "react";
import { Loading } from "../components/loading";
import Maintenance from "../components/loading/Maintenance";
import { UserProvider } from "../components/user";
import "../styles/globals.css";
import api from "../api";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import NotificationProvider from "../components/notification";

const App = ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [maintenance, setMaintenance] = useState(
        Boolean(process.env.NEXT_PUBLIC_MAINTENANCE_MODE)
    );
    const theme = createTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#FB8464",
                contrastText: "#fff",
            },
        },
    });

    useEffect(() => {
        api.getUser()
            .then((data) => {
                if (data && data.data) setUser(data.data);
            })
            .catch(() => setUser(null));

        setTimeout(() => setLoading(false), 500);
    }, []);

    return maintenance ? (
        <Maintenance />
    ) : (
        <ThemeProvider theme={theme}>
            {loading ? (
                <Loading />
            ) : (
                <UserProvider value={{ user, setUser }}>
                    <NotificationProvider>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </UserProvider>
            )}
        </ThemeProvider>
    );
};

export default App;
