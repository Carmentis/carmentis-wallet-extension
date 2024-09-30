import {useNavigate} from "react-router";




export function Home() {
    const navigate = useNavigate();

    function moveToWalletCreation() {
        navigate("/create-password")
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <h1 className="title mb-2">Create your wallet</h1>
                <p>Carmentis Wallet is a secure wallet designed to approve event.</p>
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
                <button id="import-wallet" className="btn-primary min-w-72">Import a wallet</button>
            </div>

        </>
    );
}