import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BiErrorAlt } from "react-icons/bi";
import styles from "./Notification.module.css";

const Notification = ({ dispatch, id, timeout, type, title, content }) => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        setTimeout(
            () =>
                dispatch({
                    id,
                }),
            400
        );
    };

    useEffect(() => {
        setTimeout(handleClose, timeout ?? 3500);
    }, []);
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={styles.notification}
                    initial={{
                        x: 400,
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.3 },
                    }}
                    exit={{
                        opacity: 0,
                        x: 400,
                        transition: { duration: 0.3 },
                    }}
                >
                    <div className={styles.iconContainer}>
                        {type == "success" ? (
                            <FaCheck color="#46e393" />
                        ) : (
                            <BiErrorAlt color="#ff6565" />
                        )}
                    </div>
                    <div className={styles.container}>
                        <h1>{title}</h1>
                        <p>{content}</p>
                    </div>
                    <div className={styles.close}>
                        <AiOutlineClose onClick={handleClose} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
