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

import Dashboard from "@/src/components/dashboard/Dashboard.tsx";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import OnBoarding from "@/src/components/onboarding/OnBoarding.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContainer, AuthenticationContext,
    AuthenticationGuard
} from "@/src/components/commons/AuthenticationGuard.tsx";
import {ReactElement, useContext} from "react";
import {AccountSelection} from "@/src/components/commons/AccountSelection.tsx";

/**
 * This function returns the full page entrypoint called by the main application.
 * The main interest of this component is to encapsulate the full page application inside
 * the AuthenticationGuard component, allowing every component to access numerous contexts.
 *
 * Graphically, we have (root@main.tsx -> FullPageEntrypoint@FullPageApp.tsx)
 * @constructor
 */
export function FullPageEntrypoint() : ReactElement {
    return <AuthenticationGuard>
        <FullPageApp></FullPageApp>
    </AuthenticationGuard>
}


/**
 * This function returns the full page application called by the full page entrypoint.
 *
 * Graphically, we have (root@main.tsx -> (FullPageEntrypoint -> FullPageApp)@FullPageApp.tsx)
 *
 * @constructor
 */
function FullPageApp() : ReactElement {

    let applicationInitialized = useContext(ApplicationInitializedContext);
    let accountCreated = useContext(AccountCreatedContext);
    let authentication : AuthenticationContainer = useContext(AuthenticationContext);


    return <>
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.wallet.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.wallet.isEmpty() &&
                            <>
                                { authentication.wallet.unwrap().getActiveAccountIndex().isEmpty() &&
                                    <AccountSelection/>
                                }
                                { authentication.wallet.unwrap().getActiveAccountIndex().isSome() &&
                                    <Dashboard key={authentication.wallet.unwrap().getActiveAccount().unwrap().getId()}></Dashboard>
                                }
                            </>
                        }
                    </>
                }

                { !accountCreated &&
                    <OnBoarding></OnBoarding>
                }
            </>
        }
        { !applicationInitialized &&
            <Splashscreen/>
        }
    </>;


}

export default FullPageApp;