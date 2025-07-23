
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

import {BACKGROUND_REQUEST_TYPE, BackgroundRequest} from "@/entrypoints/background.ts";

export function NoWalletDetected() {
    function goToWalletCreation() {
        const openMainRequest : BackgroundRequest = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.BROWSER_OPEN_ACTION,
            payload: {
                location: "main"
            }
        }
        browser.runtime.sendMessage(openMainRequest)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
            {/* Logo */}
            <img 
                src="https://docs.carmentis.io/img/carmentis-logo-color.png"
                alt="Carmentis Logo"
                className="w-20 h-auto mb-6"
            />

            {/* Title and description */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">No Wallet Detected</h1>
                <p className="text-gray-600">
                    Secure your digital assets with Carmentis Wallet - a modern, 
                    secure and user-friendly crypto wallet that puts you in control 
                    of your digital identity and allows you to provide and verify 
                    proof of authenticity of events being anchored on-chain.
                </p>
            </div>

            {/* Button */}
            <button 
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center"
                onClick={goToWalletCreation}
            >
                Create Your Wallet
            </button>
        </div>
    );
}
