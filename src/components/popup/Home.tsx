import "../../style.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {Wallet} from "@/src/Wallet.tsx";



export function Home({ wallet } : { wallet : Wallet }) {

    const navigate = useNavigate();


    // if the wallet is not defined, move to the login page
    if (!wallet) {
        useEffect(() => {
            navigate("/")
        }, []);
        return
    }

    const [name, setName] = useState<string>(wallet?.accounts[0].pseudo)


    function onOpenFullPage() {
        browser.runtime.sendMessage({
            action: "open",
            location: "main"
        })
    }

    function logout() {
        chrome.storage.session.clear()
        navigate("/")
    }


    return <>
        <nav className="bg-white border-gray-200 dark:bg-gray-900 border-b-2 border-gray-100">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse h-2">
                    <img src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
                        className="h-6"
                    />
                    <span
                        className="self-center text-xl font-semibold whitespace-nowrap text-black">{name}</span>
                </a>

                <button className="ring-green-400" onClick={onOpenFullPage}>Large View</button>
            </div>
        </nav>

        <div className="actions-group flex items-center justify-evenly gap-2 mt-2">
            <button className="w-36 ">Scan</button>
            <button className="w-36 " onClick={logout}>Logout</button>
        </div>

    </>
}