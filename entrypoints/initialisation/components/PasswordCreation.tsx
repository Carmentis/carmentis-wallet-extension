import {useState} from "react";
import {useNavigate} from "react-router";

interface FormCondition {
    evaluate() : boolean;
    onFailure() : void;
}

export function PasswordCreation() {
    // the state of the component
    const [password, setPassword] = useState('aaa');
    const [confirmPassword, setConfirmPassword] = useState('aaa');
    const [consent, setConsent] = useState(true);

    // errors
    const [activeForm, setActiveForm] = useState<boolean>(false);
    const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);

    // create the list of conditions that the input should satisfy
    let conditions =  [
        // passwords should match
        {
            evaluate: () => {
                return password == confirmPassword;
            },
            onFailure: () => {}
        },
        // the password should not be weak
        {
            evaluate: () => {
                return password.length >= 1;
            },
            onFailure: () => {
                setIsWeakPassword(true)
            }
        },
        // the user should accept the consent
        {
            evaluate: () => {
                return consent;
            },
            onFailure: () => {}
        }
    ]

    // checks the conditions defined above.
    function onSubmitPasswordCreation() {
        // checks conditions
        setActiveForm(true)
        let containsError = false;
        for (var condition of conditions) {
            if (!condition.evaluate()) {
                containsError = true;
                condition.onFailure();
            }
        }

        if (!containsError) {
            onCorrectPasswordCreation()
        }
    }

    // handle the case where the password is correct
    const navigate = useNavigate();
    function onCorrectPasswordCreation() {
        navigate("/recovery-phrase", {
            state: {
                password: password,
            }
        });
    }



    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Create a password</h1>
            <p className="text-justify">This password allows to unlock your wallet only on this device. Carmentis cannot help to
                recover this password.</p>

            <div className="flex items-center justify-between align-items-center justify-content-center flex-col">
                <div className="mb-4">
                    <label htmlFor="password"
                           className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="password" id="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && isWeakPassword &&
                            <p className="mt-2 text-pink-600">
                                The password is weak.
                            </p>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="confirm-password"
                           className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input type="text" name="confirm-password" id="confirm-password"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"/>
                        {activeForm && password !== confirmPassword &&
                            <p className="mt-2 text-pink-600">
                                The passwords does not match.
                            </p>
                        }
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox"
                           value={consent}
                           onChange={(e) => setConsent(e.target.checked)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox"
                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I understand that Carmentis cannot help me to recover the password.
                    </label>

                </div>
                { activeForm && !consent &&
                    <p className="mt-2 text-pink-600">
                        Accept that Carmentis cannot help yout to recover your password.
                    </p>
                }
            </div>


            <button className="btn-primary btn-highlight w-full" onClick={onSubmitPasswordCreation}>Next</button>
        </>
    );
}