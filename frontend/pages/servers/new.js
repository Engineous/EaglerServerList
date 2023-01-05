import Head from "next/head";
import styles from "../../styles/Server.module.css";
import Navbar from "../../components/navbar";
import { useUser } from "../../components/user";
import Card from "../../components/card";
import { useState, useRef, forwardRef } from "react";
import { AiOutlineForm } from "react-icons/ai";
import { BiOutline, BiRename } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import dynamic from "next/dynamic";
import Input from "../../components/input";
import RichInput from "../../components/input/richInput";
import { useEffect } from "react";
import { useRouter } from "next/router";
const Selectrix = process.browser ? dynamic(() => import("react-selectrix")) : null; // tags are cancer

export default function newServers() {
    const { user } = useUser();
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ip, setIp] = useState("");
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    });
    return (
        <>
            <Head>
                <title>
                    Eagler Server List - Server Listing
                </title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                <meta
                    property="og:description"
                    content="List your server!"
                />
                <meta
                    property="twitter:description"
                    content="List your server!"
                />
                <meta property="theme-color" content="#FB8464" />
                <meta
                    property="og:title"
                    content="Eagler Server List - Server Listing"
                />
                <meta property="og:type" content="website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.rootNew}>
                <Navbar />
                <div class={styles.formBasis}>
                    <Card
                        icon={<AiOutlineForm />}
                        text="Server Listing"   
                    >
                        <form class={styles.forminitial}>
                            <Input
                                label="Server Name"
                                placeholder="Server Name"
                                onChange={setName}
                                startIcon={<BiRename />}
                            />
                            <div style={{ marginBottom: "20px" }}></div>
                            <Input
                                label="Server Address"
                                placeholder="Server Address"
                                onChange={setIp}
                                startIcon={<HiServer />}
                            />
                            <div style={{ marginBottom: "20px" }}></div>
                            <Input
                                label="Server Description"
                                placeholder="Server Description"
                                onChange={setDescription}
                                startIcon={<MdDescription />}
                            />
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}