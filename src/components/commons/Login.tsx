import {useState} from "react";
import {SecureWalletStorage} from "@/src/WalletStorage.tsx";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";
import {Wallet} from "@/src/Wallet.tsx";
import {Optional} from "@/src/Optional.tsx";



function Login({ setWallet } : { setWallet : (Optional<Wallet>) }) {





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
        secureStorage.readContextFromLocalStorage().then(wallet => {
            // update the wallet for react
            setWallet(Optional.From(wallet));
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
