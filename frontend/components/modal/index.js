import styles from "./Modal.module.css";
import { useState, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const Modal = forwardRef(({ height, children }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            open: () => setOpen(true),
            close: () => setOpen(false),
        };
    });

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        inital={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.2,
                            },
                        }}
                        exit={{
                            opacity: 0,
                            transition: {
                                delay: 0.2,
                            },
                        }}
                        onClick={() => setOpen(false)}
                        className={styles.backdrop}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            transition: {
                                duration: 0.2,
                            },
                        }}
                        exit={{
                            scale: 0,
                            transition: {
                                delay: 0.2,
                            },
                        }}
                        className={styles.wrapper}
                        style={{
                            height: height ?? "500px",
                        }}
                    >
                        <motion.div
                            initial={{
                                x: 100,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                transition: {
                                    delay: 0.2,
                                    duration: 0.2,
                                },
                            }}
                            exit={{
                                x: 100,
                                opacity: 0,
                                transition: {
                                    duration: 0.2,
                                },
                            }}
                            className={styles.content}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

Modal.Title = ({ children, onClose }) => (
    <div className={styles.titleBar}>
        {children}
        <button className={styles.titleBarClose} onClick={onClose}>
            <AiOutlineClose />
        </button>
    </div>
);

Modal.Body = ({ children }) => <div className={styles.body}>{children}</div>;

export default Modal;
