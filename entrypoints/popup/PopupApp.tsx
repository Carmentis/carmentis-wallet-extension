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

import {useContext} from "react";
import {Splashscreen} from "@/src/components/commons/Splashscreen.tsx";
import Login from "@/src/components/commons/Login.tsx";
import {PopupDashboard} from "@/src/components/popup/PopupDashboard.tsx";
import {NoWalletDetected} from "@/src/components/popup/NoWalletDetected.tsx";
import {ActionMessageHandler} from "@/src/components/commons/ActionMessage.tsx";
import {AccountSelection} from "@/src/components/commons/AccountSelection.tsx";
import {
    AccountCreatedContext,
    ApplicationInitializedContext, AuthenticationContainer, AuthenticationContext,
    AuthenticationGuard
} from "@/src/components/commons/AuthenticationGuard.tsx";


/**
 *
 * @constructor
 */
export function PopupAppEntrypoint() {
    return <>
        <AuthenticationGuard>
            <ActionMessageHandler>
                <PopupApp></PopupApp>
            </ActionMessageHandler>
        </AuthenticationGuard>
    </>
}


function PopupApp() {


    let applicationInitialized = useContext(ApplicationInitializedContext);
    let accountCreated = useContext(AccountCreatedContext);
    let authentication : AuthenticationContainer = useContext(AuthenticationContext);


    return <>
        { !applicationInitialized &&
            <Splashscreen></Splashscreen>
        }
        { applicationInitialized &&
            <>
                { accountCreated &&
                    <>
                        { authentication.wallet.isEmpty() &&
                            <Login></Login>
                        }
                        { !authentication.wallet.isEmpty() &&
                          <>
                              { !authentication.wallet.unwrap().getActiveAccount().isEmpty() &&
                                  <PopupDashboard key={authentication.wallet.unwrap().getActiveAccount().unwrap().getId()}></PopupDashboard>
                              }
                              { authentication.wallet.unwrap().getActiveAccount().isEmpty() &&
                                  <AccountSelection></AccountSelection>
                              }

                          </>

                        }
                    </>
                }
                { !accountCreated &&
                    <NoWalletDetected/>
                }
            </>
        }

    </>;
}

export default PopupApp;
