
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

import {useAuthenticationContext} from "@/entrypoints/contexts/authentication.context.tsx";
import React, {useState} from "react";
import {useNavigate} from "react-router";
import {DropdownAccountSelection} from "@/entrypoints/components/dashboard/dropdown-account-selection.component.tsx";
import {useMainInterfaceActions} from "@/entrypoints/states/main-interface.state.tsx";
import {useApplicationNotificationHook} from "@/entrypoints/states/application-nofications.state.tsx";
import {Badge, Chip, Typography} from "@mui/material";
import {useAccountBalanceHook} from "@/entrypoints/components/hooks/sdk.hook.tsx";
import {Email, MoreVert} from "@mui/icons-material";
import {motion} from "framer-motion";

/**
 * Renders the navigation bar for the dashboard including account selection,
 * navigation menu, and relevant user actions such as accessing parameters, logging out, and help documentation.
 *
 * @return {JSX.Element} The Dashboard navigation bar component, enabling user interaction for menu toggle, navigation, and actions.
 */
export function DashboardNavbar() {
    // state to show the navigation
    const authentication = useAuthenticationContext();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    // create the navigation
    const navigate = useNavigate();


    function goToParameters() {
        setShowMenu(false);
        navigate('/parameters');
    }

    function logout() {
        setShowMenu(false);
        authentication.disconnect();
    }

    function goToHelp() {
        setShowMenu(false);
        window.open('https://docs.carmentis.io', '_blank');
    }


    return <>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 h-full">
            <div
                className="flex items-center rtl:space-x-reverse h-4 border-gray-100">

                <DropdownAccountSelection allowAccountCreation={true} large={true}></DropdownAccountSelection>
            </div>


            <div className="relative inline-block text-left">
                <div className={"flex flex-row justify-center items-center space-x-4"}>
                    <AccountBalance/>
                    <ClickableAppNotifications/>
                    <ClickableThreeDots onClick={() => setShowMenu(!showMenu)}/>
                </div>


                <div hidden={!showMenu} onMouseLeave={() => setShowMenu(false)}
                     className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                     role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                    <div className="py-1" role="none">
                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                            id="menu-item-0" onClick={goToParameters}>Parameters
                        </div>
                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                            id="menu-item-1" onClick={logout}>Logout
                        </div>
                        <div
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-green-400 hover:cursor-pointer"
                            id="menu-item-0" onClick={goToHelp}>
                            Get help
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}


function AccountBalance() {
    const balance = useAccountBalanceHook();
    if (typeof balance.data === 'number')
        return  <Chip variant={"outlined"} label={<Typography fontSize={"small"}>{balance.data} CMTS</Typography>}/>;
    return <></>
}
function ClickableAppNotifications() {
    const actions = useMainInterfaceActions();
    const {notifications, isLoading} = useApplicationNotificationHook();

    const badgeContent = isLoading ? undefined : notifications.length;
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <Badge 
                onClick={() => actions.showNotifications()} 
                badgeContent={badgeContent} 
                color="primary"
                className="cursor-pointer"
            >
                <Email className="text-gray-600" fontSize="medium" />
            </Badge>
        </motion.div>
    );
}

function ClickableThreeDots(input: {onClick: () => void}) {
    return (
        <motion.button 
            onClick={input.onClick}
            className="inline-flex justify-center rounded-full bg-white p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-expanded="true" 
            aria-haspopup="true"
        >
            <MoreVert fontSize="medium" />
        </motion.button>
    );
}
