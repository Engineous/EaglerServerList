import styles from "./Notification.module.css";
import Notification from "./Notification";
import { createContext, useContext, useReducer } from "react";
import { v4 } from "uuid";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_NOTIFICATION":
                return [...state, { ...action.payload }];
            case "REMOVE_NOTIFICATION":
                return state.filter((element) => element.id !== action.id);
            default:
                return state;
        }
    }, []);

    return <NotificationContext.Provider value={dispatch}>
            <div className={styles.notificationWrapper}>
                {state.map((note) =>(
                        <Notification
                            dispatch={dispatch}
                            key={note.id}
                            {...note}
                        />
                    )
                )}
            </div>
            {children}
        </NotificationContext.Provider>
    ;
};

export const useNotification = () => {
    const dispatch = useContext(NotificationContext);

    return ({ type: notifType, content }) => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
                id: v4(),
                type: notifType,
                title:
                    notifType == "error" ? "Something went wrong" : "Success",
                content,
            },
        });
    };
};

export default NotificationProvider;
