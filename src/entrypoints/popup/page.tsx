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


import {AuthenticationManager} from '@/entrypoints/components/authentication-manager.tsx';
import {ClientRequestStateWriter} from '@/entrypoints/components/client-request-state-writer.tsx';
import {useApplicationStatus} from '@/entrypoints/contexts/application-status.context.tsx';
import {
    activeAccountState,
    useAuthenticationContext,
    walletState
} from '@/entrypoints/contexts/authentication.context.tsx';
import {Splashscreen} from '@/entrypoints/components/Splashscreen.tsx';
import {NoWalletDetected} from '@/entrypoints/components/popup/NoWalletDetected.tsx';
import Login from '@/entrypoints/components/Login.tsx';
import AccountSelection from '@/entrypoints/components/AccountSelection.tsx';
import {PopupDashboard} from '@/entrypoints/components/popup/popup-dashboard.tsx';
import {useRecoilValue} from "recoil";
import OnBoarding from "@/entrypoints/components/onboarding/OnBoarding.tsx";
import Dashboard from "@/entrypoints/components/dashboard/dashboard.component.tsx";

/**
 *
 * @constructor
 */
export function PopupAppEntrypoint() {
    return <>
        <AuthenticationManager>
            <ClientRequestStateWriter>
                <PopupApp></PopupApp>
            </ClientRequestStateWriter>
        </AuthenticationManager>
    </>
}


function PopupApp() {
    let {accountCreated} = useApplicationStatus();
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);

    if(!accountCreated) return  <NoWalletDetected/>
    if(!wallet) return <Login/>
    if(!activeAccount) return <AccountSelection/>
    return <PopupDashboard key={wallet.activeAccountId}/>

    /*
    const wallet = useRecoilValue(walletState);
    let {applicationInitialised, accountCreated} = useApplicationStatus();


    if (!applicationInitialised) return <Splashscreen/>
    if (!accountCreated) return  <NoWalletDetected/>
    if (!wallet) return <Login/>
    if (!wallet.activeAccountId) return  <AccountSelection/>
    return  <PopupDashboard
        key={wallet.activeAccountId}
    />
     */
}

export default PopupAppEntrypoint;
