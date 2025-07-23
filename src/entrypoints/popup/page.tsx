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


import {AuthenticationManager} from '@/components/shared/AuthenticationManager.tsx';
import {ClientRequestStateWriter} from '@/components/client-request-state-writer.tsx';
import {NoWalletDetected} from '@/entrypoints/popup/NoWalletDetected.tsx';
import Login from '@/components/shared/Login.tsx';
import AccountSelection from '@/components/shared/AccountSelection.tsx';
import {PopupDashboard} from '@/components/popup/PopupDashboard.tsx';
import {useRecoilValue} from "recoil";
import {PropsWithChildren} from "react";
import {activeAccountState, walletState} from "@/states/states.tsx";
import {useApplicationStatus} from "@/hooks/useApplicationStatus.tsx";

export function PopupAppEntrypoint() {
    return <>
        <AuthenticationManager>
            <ClientRequestStateWriter>
                <PopupLayout>
                    <PopupApp></PopupApp>
                </PopupLayout>
            </ClientRequestStateWriter>
        </AuthenticationManager>
    </>
}

function PopupLayout({children}: PropsWithChildren) {
    return <div className={"max-h-[500px] h-[500px]"}>
        {children}
    </div>
}


function PopupApp() {
    let {accountCreated} = useApplicationStatus();
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);

    if(!accountCreated) return  <NoWalletDetected/>
    if(!wallet) return <Login/>
    if(!activeAccount) return <AccountSelection/>
    return <PopupDashboard key={wallet.activeAccountId}/>
}

export default PopupAppEntrypoint;
