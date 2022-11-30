import { useState } from "react";
import Loading from "../components/loading";
import { UserProvider } from "../components/user";
import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false);
    }, 1000);

    return loading ? (
        <Loading />
    ) : (
        <UserProvider value={{ user, setUser }}>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default App;
