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

import {atom, selector, useRecoilValue} from "recoil";
import {activeAccountState} from "@/entrypoints/contexts/authentication.context.tsx";
import {ApplicationDataStorageDB} from "@/entrypoints/main/application-data-storage-helper.tsx";
import {useLiveQuery} from "dexie-react-hooks";

export interface AppNotification {
    notificationId?: string,
    ts: number,
    title: string,
    message: string,
    seen: boolean,
    link?: string,
    buttonMessage?: string
}

export const appNotificationState = selector<AppNotification[]>({
    key: 'appNotifications',
    get: async ({get}) => {
        const activeAccount = get(activeAccountState);
        if (activeAccount) {
            const db = await ApplicationDataStorageDB.connectDatabase(activeAccount);
            const transactions = await db.notifications.orderBy('ts').toArray();
            return transactions;
        } else {
            return []
        }
    },
});

export function useApplicationNotificationHook() {
    const activeAccount = useRecoilValue(activeAccountState);
    const storedNotifications: AppNotification[] | undefined = useLiveQuery(async () => {
        if (activeAccount) {
            const db = await ApplicationDataStorageDB.connectDatabase(activeAccount)
            const result = await db.notifications.orderBy('ts').toArray();
            if (result) return result
            else return []
        } else {
            return []
        }
    })

    return {
        isLoading: storedNotifications === undefined,
        notifications: storedNotifications ? storedNotifications : []
    }

}
