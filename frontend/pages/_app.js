import { useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { UserProvider } from "../components/user";
import "../styles/globals.css";
import api from "../api";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const App = ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

    return loading ? (
        <Loading />
    ) : (
        <UserProvider value={{ user, setUser }}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </UserProvider>
    );
};

export default App;
