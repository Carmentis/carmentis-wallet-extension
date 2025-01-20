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


import { ReactElement } from 'react';
import { AuthenticationManager } from '@/entrypoints/main/components/commons/authentication-manager.tsx';
import { useApplicationStatus } from '@/entrypoints/main/contexts/application-status.context.tsx';
import { useAuthenticationContext } from '@/entrypoints/main/contexts/authentication.context.tsx';
import { Splashscreen } from '@/entrypoints/main/components/commons/Splashscreen.tsx';
import OnBoarding from '@/entrypoints/main/components/onboarding/OnBoarding.tsx';
import Login from '@/entrypoints/main/components/commons/Login.tsx';
import AccountSelection from '@/entrypoints/main/components/commons/AccountSelection.tsx';
import Dashboard from '@/entrypoints/main/components/dashboard/Dashboard.tsx';

/**
 * This function returns the full page entrypoint called by the main application.
 * The main interest of this component is to encapsulate the full page application inside
 * the AuthenticationManager component, allowing every component to access numerous contexts.
 *
 * Graphically, we have (root@main.tsx -> FullPageEntrypoint@page.tsx)
 * @constructor
 */
export function FullPageEntrypoint() : ReactElement {
    return <AuthenticationManager>
        <FullPageApp></FullPageApp>
    </AuthenticationManager>
}


/**
 * This function returns the full page application called by the full page entrypoint.
 *
 * Graphically, we have (root@main.tsx -> (FullPageEntrypoint -> FullPageApp)@page.tsx)
 *
 * @constructor
 */
function FullPageApp() : ReactElement {

    let {applicationInitialised, accountCreated} = useApplicationStatus();
    let authentication = useAuthenticationContext();

    if (!applicationInitialised) return <Splashscreen/>
    if(!accountCreated) return  <OnBoarding></OnBoarding>

    const wallet = authentication.wallet;
    if(wallet.isEmpty()) return <Login/>

    const activeAccount = wallet.unwrap().getActiveAccount();
    if(activeAccount.isEmpty()) return <AccountSelection/>
    return <Dashboard key={activeAccount.unwrap().getId()} />


}

export default FullPageEntrypoint;