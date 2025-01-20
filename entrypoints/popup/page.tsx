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



import { AuthenticationManager } from '@/entrypoints/main/components/commons/authentication-manager.tsx';
import { ActionMessageHandler } from '@/entrypoints/main/components/commons/ActionMessage.tsx';
import { useApplicationStatus } from '@/entrypoints/main/contexts/application-status.context.tsx';
import { useAuthenticationContext } from '@/entrypoints/main/contexts/authentication.context.tsx';
import { Splashscreen } from '@/entrypoints/main/components/commons/Splashscreen.tsx';
import { NoWalletDetected } from '@/entrypoints/main/components/popup/NoWalletDetected.tsx';
import Login from '@/entrypoints/main/components/commons/Login.tsx';
import AccountSelection from '@/entrypoints/main/components/commons/AccountSelection.tsx';
import { PopupDashboard } from '@/entrypoints/main/components/popup/PopupDashboard.tsx';

/**
 *
 * @constructor
 */
export function PopupAppEntrypoint() {
    return <>
        <AuthenticationManager>
            <ActionMessageHandler>
                <PopupApp></PopupApp>
            </ActionMessageHandler>
        </AuthenticationManager>
    </>
}


function PopupApp() {
    let {applicationInitialised, accountCreated} = useApplicationStatus();
    let authentication = useAuthenticationContext();


    if (!applicationInitialised) return <Splashscreen/>
    if (!accountCreated) return  <NoWalletDetected/>
    const wallet = authentication.wallet;
    if (wallet.isEmpty()) return <Login/>
    if (wallet.unwrap().getActiveAccount().isEmpty()) return  <AccountSelection/>
    return  <PopupDashboard
        key={wallet.unwrap().getActiveAccount().unwrap().getId()}
    />
}

export default PopupAppEntrypoint;
