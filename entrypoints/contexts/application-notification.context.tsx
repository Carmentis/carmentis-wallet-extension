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

import {atom, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {useLocalStorage} from "react-use";
import {activeAccountState} from "@/entrypoints/contexts/authentication.context.tsx";
import {PropsWithChildren, useEffect} from "react";
import {AppNotification, appNotificationState} from "@/entrypoints/states/application-nofications.state.tsx";
import {useLiveQuery} from "dexie-react-hooks";
import {ApplicationDataStorageDB} from "@/entrypoints/main/application-data-storage-helper.tsx";
import {Account} from "@/entrypoints/main/Account.tsx";
import notify = chrome.fileSystemProvider.notify;



const INITIAL_APP_NOTIFICATION_LOCAL_STORAGE: AppNotification[] = []
export default function ApplicationNotificationContext({children}: PropsWithChildren) {
    const notifications = useRecoilValue(appNotificationState);
    return <>{children}</>
}

export function useAppNotification() {
    const activeAccount = useRecoilValue(activeAccountState);
    return {
        notify: async (title: string, message: string) => {
            if (activeAccount) {
                const db = await ApplicationDataStorageDB.connectDatabase(activeAccount);
                db.notifications.put({
                    message: message,
                    seen: false,
                    title: title,
                    ts: new Date().getTime()
                })
            }
        },
        notifyWithButtonLink: async (title: string, message: string, buttonMessage: string, link: string) => {
            if (activeAccount) {
                const db = await ApplicationDataStorageDB.connectDatabase(activeAccount);
                db.notifications.put({
                    message: message,
                    seen: false,
                    title: title,
                    ts: new Date().getTime(),
                    link: link,
                    buttonMessage: buttonMessage
                })
            }
        }
    }
}