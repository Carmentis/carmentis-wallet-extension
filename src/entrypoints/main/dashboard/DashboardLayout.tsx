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

export interface DashboardLayoutProps {
    navbar: ReactElement,
    sidebar: ReactElement,
}

export function DashboardLayout({children, navbar, sidebar}: PropsWithChildren<DashboardLayoutProps>) {
    return (
        <div id="main-layout" className="w-full h-full">
            {/* Fixed navbar */}
            <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full h-16 z-10">
                {navbar}
            </nav>

            {/* Main content area with sidebar */}
            <div className="pt-16 h-full w-full flex">
                {/* Fixed sidebar */}
                <aside className="fixed top-16 bottom-0 w-16 border-r border-gray-200 bg-white overflow-y-auto">
                    {sidebar}
                </aside>

                {/* Main content */}
                <main className="flex-1 ml-16 overflow-y-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}