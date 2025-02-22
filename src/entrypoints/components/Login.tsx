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

import {useState} from "react";
import {SecureWalletStorage} from "@/utils/db/wallet-storage.ts";
import {CarmentisProvider} from "@/providers/carmentisProvider.tsx";
import {useAuthenticationContext,} from '@/entrypoints/contexts/authentication.context.tsx';


function Login() {

    // recover the wallet update from the context
    const {connect} = useAuthenticationContext();


    // states to handle the login
    const [password, setPassword] = useState("");
    const [invalidPassword, setInvalidPassword] = useState(false);

    /**
     * This function is executed when the user attempts to login in.
     *
     * To login, the application attempts to decrypt the provided seed. If the password fails then the password
     * is considered as invalid.
     */
    async function onLogin() {
        let provider = new CarmentisProvider();
        let secureStorage = await SecureWalletStorage.CreateSecureWalletStorage(provider, password);
        secureStorage.readWalletFromStorage().then(wallet => {
            connect(wallet)
        }).catch(error => {
            console.log("An error occured during the wallet reading: ", error)
            setInvalidPassword(true);
        })
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto"
                         src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg"
                         alt="Your Company"/>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in
                        to your wallet</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6 mb-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"
                                       className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       required
                                       className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"/>
                                { invalidPassword &&
                                    <p className="mt-2 text-pink-600">
                                        Invalid password
                                    </p>
                                }
                            </div>
                        </div>

                        <div>
                            <button
                                    onClick={onLogin}
                                    className="flex w-full justify-center rounded-md bg-green-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300">Sign
                                in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
