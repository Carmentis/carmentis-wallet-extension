
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

import { useAuthenticationContext } from "@/entrypoints/contexts/authentication.context.tsx";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { DropdownAccountSelection } from "@/entrypoints/components/dashboard/DropdownAccountSelection.tsx";
import { useMainInterfaceActions } from "@/entrypoints/states/main-interface.state.tsx";
import { useApplicationNotificationHook } from "@/entrypoints/states/application-nofications.state.tsx";
import { 
  Badge, 
  Chip, 
  Typography, 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  Tooltip as MuiTooltip
} from "@mui/material";
import { useAccountBalanceHook } from "@/entrypoints/components/hooks/sdk.hook.tsx";
import { 
  Email, 
  MoreVert, 
  Settings, 
  Logout, 
  Help, 
  AccountBalance as AccountBalanceIcon,
  Notifications
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilValue } from "recoil";
import { activeAccountState } from "@/entrypoints/contexts/authentication.context.tsx";

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

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <AppBar position="static" elevation={0} color={"transparent"} className="bg-white border-b border-gray-200">
        <Toolbar className="flex justify-between items-center">
          {/* Left side - Logo and Account Selection */}
          <motion.div variants={itemVariants} className="flex items-center">
            <Box className="mr-4">
              <img 
                src="https://cdn.prod.website-files.com/66018cbdc557ae3625391a87/662527ae3e3abfceb7f2ae35_carmentis-logo-dark.svg" 
                alt="Carmentis" 
                className="h-8"
              />
            </Box>
            <DropdownAccountSelection allowAccountCreation={true} large={true} />
          </motion.div>

          {/* Right side - Actions */}
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <BalanceChip />
            <NotificationsButton />

            {/* Menu Button */}
            <MuiTooltip title="Account menu">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleMenuClick}
                  size="small"
                  edge="end"
                  aria-label="account menu"
                  aria-controls={menuOpen ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : undefined}
                  className="ml-1"
                >
                  <Avatar 
                    className="bg-green-100 text-green-600"
                    sx={{ width: 32, height: 32 }}
                  >
                    {activeAccount?.firstname?.charAt(0) || ''}
                  </Avatar>
                </IconButton>
              </motion.div>
            </MuiTooltip>

            {/* Dropdown Menu */}
            <Menu
              id="account-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 2,
                className: "mt-1.5 rounded-md border border-gray-100"
              }}
            >
              <MenuItem onClick={goToParameters} className="py-2">
                <ListItemIcon>
                  <Settings fontSize="small" className="text-gray-600" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>

              <MenuItem onClick={goToHelp} className="py-2">
                <ListItemIcon>
                  <Help fontSize="small" className="text-gray-600" />
                </ListItemIcon>
                <ListItemText primary="Help & Documentation" />
              </MenuItem>

              <Divider />

              <MenuItem onClick={logout} className="py-2 text-red-600">
                <ListItemIcon>
                  <Logout fontSize="small" className="text-red-600" />
                </ListItemIcon>
                <ListItemText primary="Logout" className="text-red-600" />
              </MenuItem>
            </Menu>
          </motion.div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

/**
 * Balance chip component showing the user's token balance
 */
function BalanceChip() {
  const balance = useAccountBalanceHook();

  if (balance.isLoading) {
    return (
        <div className={"flex animate-pulse items-center gap-1.5 rounded-full bg-[#F1F1FB] py-1.5 ps-3 pe-3.5 text-sm font-medium text-[#5D5BD0] hover:bg-[#E4E4F6] dark:bg-[#373669] dark:text-[#DCDBF6] dark:hover:bg-[#414071]"}>
          <Typography variant="body2" className="font-medium text-blue-700">
            --,-- CMTS
          </Typography>
        </div>
        );
  }

  if (typeof balance.data !== 'number') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={"flex items-center gap-1.5 rounded-full bg-[#F1F1FB] py-1.5 ps-3 pe-3.5 text-sm font-medium text-[#5D5BD0] hover:bg-[#E4E4F6] dark:bg-[#373669] dark:text-[#DCDBF6] dark:hover:bg-[#414071]"}>
        <Typography variant="body2" className="font-medium text-blue-700">
          {balance.data} CMTS
        </Typography>
      </div>

    </motion.div>
  );
}

/**
 * Notifications button component
 */
function NotificationsButton() {
  const actions = useMainInterfaceActions();
  const { notifications, isLoading } = useApplicationNotificationHook();
  const badgeContent = isLoading ? undefined : notifications.length;

  return (
    <MuiTooltip title="Notifications">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton 
          onClick={() => actions.showNotifications()}
          size="medium"
          className="text-gray-600"
        >
          <Badge 
            badgeContent={badgeContent} 
            color="primary"
            overlap="circular"
          >
            <Notifications />
          </Badge>
        </IconButton>
      </motion.div>
    </MuiTooltip>
  );
}
