/*
import {createContext, ReactElement, useState} from "react";
import {Optional} from "@/src/Optional.tsx";

export enum NotificationType {
    INFO = "info",
    ERROR = "error",
}

export interface NotificationItem {
    type : NotificationType,
    title: string,
    message : string
}

export interface NotificationInterface {
    addNotification( notification : NotificationType ) : void
}

const NotificationContext = createContext<NotificationInterface>({
    addNotification( notification : NotificationType ) : void {}
})

export class NotificationManager implements NotificationInterface {
    constructor(private notification) {
    }
}

export function NotificationPage(props: { children: ReactElement }) {

    const [notifications, setNotifications] = useState<NotificationInterface>(new N);

    setNotifications()

    return <>
        <LoggerContext.Provider value={logger}>
                        {props.children}
        </LoggerContext.Provider>
    </>;


}*/