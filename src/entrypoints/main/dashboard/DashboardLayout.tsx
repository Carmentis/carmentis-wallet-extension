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

import {PropsWithChildren, ReactElement} from "react";
import {motion} from "framer-motion";
import {Container} from "@mui/material";

export interface DashboardLayoutProps {
    navbar: ReactElement,
    sidebar: ReactElement,
}

export function DashboardLayout({children, navbar, sidebar}: PropsWithChildren<DashboardLayoutProps>) {
    return (
        <div id="main-layout" className="w-full h-full z-0">
            <motion.nav
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.3}}
                className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full h-16 z-10"
            >
                {navbar}
            </motion.nav>
            <div className="pt-16 h-full w-full">
                <motion.div
                    initial={{x: -20, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 0.3, delay: 0.1}}
                    className="fixed h-full w-16 border-r border-gray-200 bg-white shadow-sm z-0"
                >
                    {sidebar}
                </motion.div>
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.3, delay: 0.2}}
                    className="h-full w-full pl-16 overflow-y-auto bg-gray-50 z-0"
                >
                    <Container className="py-8">
                        {children}
                    </Container>
                </motion.div>
            </div>
        </div>
    );
}