/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Button, Card, CardContent, Drawer, Typography} from "@mui/material";
import {PropsWithChildren, ReactElement} from "react";
import {useRecoilValue} from "recoil";
import {
    AppNotification,
} from "@/entrypoints/states/application-nofications.state.tsx";
import {mainInterfaceState} from "@/entrypoints/states/main-interface.state.tsx";
import {useNavigate} from "react-router";
import {NotificationStorageDB} from "@/utils/db/NotificationStorageDB.ts";
import {activeAccountState} from "@/states/globals.tsx";
import {useMainInterfaceActions} from "@/hooks/useMainInterfaceAction.tsx";
import {useApplicationNotification} from "@/hooks/useApplicationNotification.tsx";



export default function NotificationRightBar() {

    const {notifications} = useApplicationNotification();

    const mainInterfaceStatus = useRecoilValue(mainInterfaceState);
    const mainInterfaceActions = useMainInterfaceActions();

    // display the notification
    const content : ReactElement[] = [];
    notifications.forEach((n, i) => {
        if (n.link && n.buttonMessage) {
            content.push(<TitleMessageButtonNotification {...n} key={i} />)
        } else {
            content.push(<TitleMessageNotification {...n} key={i} />)
        }
    })

    const emptyContent = <div className={"flex h-full w-full justify-center items-center min-w-72"}>
        <i className={"bi bi-envelope-fill text-3xl text-gray-300"}></i>
    </div>

    return <Drawer
        anchor={'right'}
        open={mainInterfaceStatus.showNotifications}
        onClose={() => mainInterfaceActions.hideNotifications()}
    >

        <div className={"w-full h-full bg-gray-50 overflow-y-auto p-4 space-y-4 min-w-72"}>
            <Typography><i className={"bi bi-bell-fill mr-2"}></i>Notifications</Typography>
            {notifications.length === 0 ? emptyContent : content}
        </div>
    </Drawer>
}

function NotificationBaseCard({children, title, message, notificationId}: PropsWithChildren<AppNotification>) {

    const activeAccount = useRecoilValue(activeAccountState);

    async function deleteNotification() {
        if (activeAccount) {
            console.log("Deletion of notification:", notificationId)
            const db = await NotificationStorageDB.connectDatabase();
            const result = await db.notifications.delete(notificationId)
            console.log(`Notification deletion result:`, result)
        }
    }

    return <Card>
        <CardContent className={"!p-4 w-72"}>
            <div className="flex justify-between">
                <Typography variant="h6" className={"font-bold"}>{title}</Typography>
                <i className={"bi bi-x-lg hover:bg-gray-50 cursor-pointer"} onClick={deleteNotification}></i>
            </div>
            <Typography variant={"body2"}>{message}</Typography>
            {children}
        </CardContent>
    </Card>
}

function TitleMessageNotification(notification : AppNotification) {
    return <NotificationBaseCard {...notification}/>
}

function TitleMessageButtonNotification(notification : AppNotification) {
    const navigate = useNavigate();
    const mainInterfaceActions = useMainInterfaceActions();
    return <NotificationBaseCard {...notification}>
        <div className="flex justify-end mt-2">
            <Button onClick={() => {
                if (notification.link) {
                    navigate(notification.link);
                    mainInterfaceActions.hideNotifications();
                }
            }
            }>
                {notification.buttonMessage}
            </Button>
        </div>
    </NotificationBaseCard>
}

