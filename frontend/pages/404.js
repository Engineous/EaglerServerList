import Link from "next/link";
import Navbar from "../components/navbar";

const Error404 = () => (
    <div>
        <Navbar />
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
                height: "calc(100vh - 60px)",
            }}
        >
            <h1>Oops!</h1>
            <p>
                Looks like you took a wrong turn.{" "}
                <Link href="/">
                    <span>Go home?</span>
                </Link>
            </p>
        </div>
    </div>
);

export default Error404;
