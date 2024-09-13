console.log('Hello content script.');
export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    console.log('Hello content.');

    const port = browser.runtime.connect({name: 'carmentis-wallet'});
    browser.runtime.onMessage.addListener(async (message) => {
      console.log('content received:', message);
    });

    window.addEventListener('message', async (message) => {
      console.log("Standard message reçu in content :", message);
      port.postMessage(message.data); //sent to background
    });


    /*browser.runtime.onMessageExternal.addListener(async (message) => {
        console.log("Message reçu in content :", message, "oui")
        // Assurez-vous que le message vient de la source attendue
        if (message.data.type === "openPopupRequest") {
            await browser.browserAction.openPopup();
            return 'Popup ouvert';
        }
    });*/

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: (container) => {
        console.log('Carmentis Wallet mounted');
        //const wallet = retrieveWallet();
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = 'Carmentis Wallet installed';
        console.log('Carmentis Wallet installed')

        /*var s = document.createElement('script');
        s.type = 'module';
        s.src = browser.runtime.getURL('/carmentis-wallet.js');
        //s.onload = function() { this.remove(); };
// see also "Dynamic values in the injected code" section in this answer
        (document.head || document.documentElement).appendChild(s);
*/
          const script = document.createElement('script');
          script.type = 'module'; // Optional, if using ES6 modules
          script.src = browser.runtime.getURL('/vendor/carmentis-wallet-init.js');
          container.append(script);

      },
    });

    ui.mount();
  }
});
