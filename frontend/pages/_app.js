import { useEffect, useState } from "react";
import Loading from "../components/loading";
import { UserProvider } from "../components/user";
import "../styles/globals.css";
import api from "../api";

const App = ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <Component {...pageProps} />
        </UserProvider>
    );
};

export default App;
