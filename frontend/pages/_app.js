import { useState } from "react";
import { UserProvider } from "../components/user";
import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
    const [user, setUser] = useState(null);

    return (
        <UserProvider value={{ user, setUser }}>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default App;
