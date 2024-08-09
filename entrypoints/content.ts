export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    console.log('Hello content.');

    const port = browser.runtime.connect({name: 'carmentis-wallet'});
    port.onMessage.addListener((message) => {
      console.log('content received:', message);
    });

    window.addEventListener('message', async (event) => {
      console.log("Message reçu in content :", event);
      port.postMessage(event.data);
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
        //const wallet = retrieveWallet();
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = 'Carmentis Wallet installed';

        /*var s = document.createElement('script');
        s.type = 'module';
        s.src = browser.runtime.getURL('/carmentis-wallet.js');
        //s.onload = function() { this.remove(); };
// see also "Dynamic values in the injected code" section in this answer
        (document.head || document.documentElement).appendChild(s);
*/
        const script = document.createElement('script');
        script.textContent = `
const CarmentisWallet = class {
    hello = function () {
        console.log('Hello from Carmentis Wallet!');
    },
    input(data) {
        console.log('Input to Carmentis Wallet:', data);
        
    }
};
window.carmentisWallet = new CarmentisWallet;`;
        app.append(script);

        container.append(app);
      },
    });
  }
});
