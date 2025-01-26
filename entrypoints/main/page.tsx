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


import {ReactElement} from 'react';
import {AuthenticationManager} from '@/entrypoints/components/authentication-manager.tsx';
import {useApplicationStatus} from '@/entrypoints/contexts/application-status.context.tsx';
import {activeAccountState, walletState,} from '@/entrypoints/contexts/authentication.context.tsx';
import OnBoarding from '@/entrypoints/components/onboarding/OnBoarding.tsx';
import Login from '@/entrypoints/components/Login.tsx';
import AccountSelection from '@/entrypoints/components/AccountSelection.tsx';
import Dashboard from '@/entrypoints/components/dashboard/Dashboard.tsx';
import {useRecoilValue} from 'recoil';

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

    let {accountCreated} = useApplicationStatus();
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);

    if(!accountCreated) return  <OnBoarding></OnBoarding>
    if(!wallet) return <Login/>
    if(!activeAccount) return <AccountSelection/>
    return <Dashboard key={activeAccount.id} />
}

export default FullPageEntrypoint;