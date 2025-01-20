
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

export function NoWalletDetected() {

    function goToWalletCreation() {
        browser.runtime.sendMessage({
            action: "open",
            location: "main"
        })
    }

    function goToDocumentation()  {
        const action = window.open("https://docs.carmentis.io/", '_blank');
        if (action) {
            action.focus();
        }
    }

    return <>
        <div className="content p-4">
            <h1>Create an account</h1>

            <p>It appears that you do not have a wallet yet. To create your wallet, click on the button
                below. </p>

            <div className="flex items-center justify-center mt-4">

                <button className="btn-primary btn-highlight" onClick={goToWalletCreation}>Create a wallet</button>
            </div>

            <hr className="mt-4 mb-4"/>

            <h1>Learn more about wallet</h1>

            <p>You want to learn more about the wallet provided by Carmentis ? Feel free to read our documentation.
            </p>

            <div className="flex items-center justify-center mt-4">

                <button className="btn-primary" onClick={goToDocumentation}>Learn more</button>
            </div>
        </div>

    </>;
}