
import {Route, Routes} from "react-router";
import {PasswordCreation} from "@/src/components/onboarding/PasswordCreation.tsx";
import {RecoveryPhrase} from "@/src/components/onboarding/RecoveryPhrase.tsx";
import {SetupWallet} from "@/src/components/onboarding/SetupWallet.tsx";
import {Landing} from "@/src/components/onboarding/Landing.tsx";
import {ImportWallet} from "@/src/components/onboarding/ImportWallet.tsx";
function OnBoarding() {

    return (
        <>
            <div id="app-content" className="flex min-h-full justify-center flex-col">
                <div className="app-header mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <img
                        src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg"
                        alt=""/>
                </div>
                <div className="app-body">
                    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
                        <div
                            className="app-modal mt-10 sm:mx-auto sm:w-full xs:max-w-xs lg:w-6/12 border-solid border-2 rounded-2xl p-4">

                            <Routes>

                                <Route path="/create-password" element={< PasswordCreation />}></Route>
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
