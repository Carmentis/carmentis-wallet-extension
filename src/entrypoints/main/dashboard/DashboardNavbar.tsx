
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

import React from "react";
import { useNavigate } from "react-router";
import { DropdownAccountSelection } from "@/components/shared/DropdownAccountSelection.tsx";
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Tooltip as MuiTooltip
} from "@mui/material";
import {
    Settings,
    Logout,
    Help,
    Notifications,
    NetworkCheck
} from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import axios from 'axios';
import { useEffect, useState } from "react";
import { SpinningWheel } from "@/components/shared/SpinningWheel.tsx";
import {activeAccountState, walletState} from "@/states/globals.tsx";
import {useAuthenticationContext} from "@/hooks/useAuthenticationContext.tsx";
import {useMainInterfaceActions} from "@/hooks/useMainInterfaceAction.tsx";
import {useApplicationNotification} from "@/hooks/useApplicationNotification.tsx";
import CarmentisLogoDark from "@/components/shared/CarmentisLogoDark.tsx";
import {useAccountBalanceBreakdown} from "@/hooks/useAccountBalanceBreakdown.tsx";
import {CMTSToken} from "@cmts-dev/carmentis-sdk/client";

/**
 * Renders the navigation bar for the dashboard including account selection,
 * navigation menu, and relevant user actions such as accessing parameters, logging out, and help documentation.
 *
 * @return {JSX.Element} The Dashboard navigation bar component, enabling user interaction for menu toggle, navigation, and actions.
 */
export function DashboardNavbar() {
    // State for menu
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchorEl);

    // Authentication and navigation
    const authentication = useAuthenticationContext();
    const navigate = useNavigate();

    // Active account
    const activeAccount = useRecoilValue(activeAccountState);

    // Menu handlers
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // Navigation functions
    function goToParameters() {
        handleMenuClose();
        navigate('/parameters');
    }

    function logout() {
        handleMenuClose();
        authentication.disconnect();
    }

    function goToHelp() {
        handleMenuClose();
        window.open('https://docs.carmentis.io', '_blank');
    }

    return (
        <div className="w-full bg-white border-b border-gray-200">
            <div className="flex justify-between items-center h-16 px-6">
                {/* Left - Logo and Account */}
                <div className="flex items-center gap-4">
                    <CarmentisLogoDark className="h-6"/>
                    <DropdownAccountSelection allowAccountCreation={true} large={false} />
                </div>

                {/* Right - Balance, Status, Notifications, Menu */}
                <div className="flex items-center gap-3">
                    <BalanceDisplay />
                    <NodeStatusIcon />
                    <NotificationsButton />

                    {/* Account Menu */}
                    <MuiTooltip title="Account">
                        <IconButton
                            onClick={handleMenuClick}
                            size="small"
                            className="text-gray-600"
                        >
                            <Avatar
                                className="bg-gray-100 text-gray-700"
                                sx={{ width: 32, height: 32 }}
                            >
                                {activeAccount?.pseudo?.charAt(0) || '?'}
                            </Avatar>
                        </IconButton>
                    </MuiTooltip>

                    <Menu
                        anchorEl={menuAnchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={goToParameters}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </MenuItem>
                        <MenuItem onClick={goToHelp}>
                            <ListItemIcon>
                                <Help fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Help" />
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={logout}>
                            <ListItemIcon>
                                <Logout fontSize="small" className="text-red-600" />
                            </ListItemIcon>
                            <ListItemText primary="Logout" className="text-red-600" />
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    );
}

/**
 * Simplified node status icon with periodic polling (30s interval)
 */
function NodeStatusIcon() {
    const wallet = useRecoilValue(walletState);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const nodeUrl = wallet?.nodeEndpoint || '';

    useEffect(() => {
        const checkConnection = async () => {
            setIsLoading(true);
            try {
                await axios.get(nodeUrl, { timeout: 5000 });
                setIsConnected(true);
            } catch (error) {
                setIsConnected(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (nodeUrl) {
            checkConnection();

            // Poll every 30 seconds to avoid spamming the node
            const intervalId = setInterval(checkConnection, 30000);

            return () => clearInterval(intervalId);
        }
    }, [nodeUrl]);

    const tooltipText = isLoading ? 'Connecting...' : isConnected ? 'Node connected' : 'Node disconnected';
    const iconColor = isLoading ? 'text-gray-400' : isConnected ? 'text-green-600' : 'text-red-600';

    return (
        <MuiTooltip title={tooltipText}>
            <div className={iconColor}>
                {isLoading ? (
                    <div className="w-5 h-5">
                        <SpinningWheel />
                    </div>
                ) : (
                    <NetworkCheck fontSize="small" />
                )}
            </div>
        </MuiTooltip>
    );
}


/**
 * Simple balance display showing total spendable balance
 */
function BalanceDisplay() {
    const { breakdown, isLoadingBreakdown, breakdownLoadingError } = useAccountBalanceBreakdown();

    if (isLoadingBreakdown) {
        return (
            <div className="text-sm text-gray-500 animate-pulse">
                Loading...
            </div>
        );
    }

    if (breakdownLoadingError || !breakdown) {
        return (
            <MuiTooltip title="Failed to load balance">
                <div className="text-sm text-red-600">
                    Error
                </div>
            </MuiTooltip>
        );
    }

    const { spendable } = breakdown.getBreakdown();

    return (
        <div className="text-sm font-medium text-gray-900 px-3 py-1.5 bg-gray-50 rounded-lg">
            {CMTSToken.createAtomic(spendable).toString()}
        </div>
    );
}

/**
 * Notifications button component
 */
function NotificationsButton() {
    const actions = useMainInterfaceActions();
    const { notifications, isLoading } = useApplicationNotification();
    const badgeContent = isLoading ? undefined : notifications.length;

    return (
        <MuiTooltip title="Notifications">
            <IconButton
                onClick={() => actions.showNotifications()}
                size="small"
                className="text-gray-600"
            >
                <Badge
                    badgeContent={badgeContent}
                    color="primary"
                    overlap="circular"
                >
                    <Notifications fontSize="small" />
                </Badge>
            </IconButton>
        </MuiTooltip>
    );
}
