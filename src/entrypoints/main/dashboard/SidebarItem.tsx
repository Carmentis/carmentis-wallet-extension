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

import {useLocation, useNavigate} from "react-router";
import {Tooltip} from "@mui/material";
import {motion} from "framer-motion";
import {ReactNode} from "react";

export interface SidebarLinkProps {
    icon: ReactNode,
    text: string,
    link: string,
    activeRegex: RegExp,
}

export function SidebarItem({icon, text, link, activeRegex}: SidebarLinkProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = activeRegex.test(location.pathname);

    function go() {
        navigate(link);
    }

    return (
        <Tooltip title={text} placement="right">
            <motion.div
                onClick={go}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className={`flex w-full justify-center items-center h-11 cursor-pointer transition-colors duration-200 ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:text-blue-500"
                }`}
            >
                <div className="text-lg">
                    {icon}
                </div>
            </motion.div>
        </Tooltip>
    );
}