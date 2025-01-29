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

export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    const port = browser.runtime.connect({name: 'carmentis-wallet'});
    console.log("[content] port created:", port)

    window.addEventListener('message', async (message) => {
      console.log("[content] message received:", message);
      // send to background
      port.postMessage(JSON.stringify({
        target: 'carmentis-wallet/background',
        request: message,
        data: message.data,
        origin: message.origin,
        from: 'content'
      }));
    });


    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: (container) => {
        console.log('Carmentis Wallet mounted');

        const script = document.createElement('script');
        script.type = 'module'; // Optional, if using ES6 modules
        script.src = browser.runtime.getURL('/vendor/carmentis-wallet-init.js');
        container.append(script);

      },
    });

    ui.mount();
  },
});
