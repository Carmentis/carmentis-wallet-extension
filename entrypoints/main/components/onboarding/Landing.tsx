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

import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";


export function Landing() {
    const navigate = useNavigate();
    const {t} = useTranslation();



    function moveToWalletCreation() {
        navigate("/create-password", {
            state: {
                nextStep: "/recovery-phrase"
            }
        })
    }

    function moveToWalletImportation() {
        navigate("/create-password",{
            state: {
                nextStep: "/import-wallet"
            }
        })
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="title mb-2">{t("onboarding.create-wallet.title")}</h1>
                <p>{t("onboarding.create-wallet.subtitle")}</p>
                <img src="https://docs.carmentis.io/img/carmentis-logo-color.png"/>

                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox" value=""
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox"
                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I accept the Usage Conditions of Carmentis.</label>
                </div>

                <button id="create-wallet" className="btn-primary btn-highlight min-w-72 mb-3" onClick={moveToWalletCreation}>Create your
                    wallet
                </button>
                <button id="import-wallet" className="btn-primary min-w-72" onClick={moveToWalletImportation}>Import a wallet</button>
            </div>

        </>
    );
}