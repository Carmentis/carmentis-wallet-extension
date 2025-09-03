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

import {Route, Routes} from "react-router";
import {PseudoPasswordCreation} from "@/components/onboarding/PseudoPasswordCreation.tsx";
import {RecoveryPhrase} from "@/components/onboarding/RecoveryPhrase.tsx";
import {SetupWallet} from "@/components/onboarding/SetupWallet.tsx";
import {Landing} from "@/components/onboarding/Landing.tsx";
import {ImportWallet} from "@/components/onboarding/ImportWallet.tsx";
import CarmentisLogoDark from "@/components/shared/CarmentisLogoDark.tsx";
import React from "react";

function OnBoarding() {
    return (
        <>
            <div id="app-content" className="flex min-h-full justify-center flex-col bg-linear-to-b from-white to-gray-50">
                <div className="app-header mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <CarmentisLogoDark className={"h-10"}/>
                </div>
                <div className="app-body">
                    <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8">
                        <div
                            className="app-modal sm:mx-auto sm:w-full xs:max-w-xs lg:w-6/12 bg-white shadow-lg rounded-xl p-6 transition-all duration-300">

                            <Routes>
                                <Route path="/create-password" element={< PseudoPasswordCreation />}></Route>
                                <Route path="/recovery-phrase" element={< RecoveryPhrase />}></Route>
                                <Route path="/setup-wallet" element={< SetupWallet />}></Route>
                                <Route path="/import-wallet" element={<ImportWallet />}></Route>
                                <Route path="*" element={< Landing/>}></Route>
                            </Routes>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default OnBoarding;
