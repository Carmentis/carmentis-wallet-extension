export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {
    console.log('Hello content.');

    const port = browser.runtime.connect({name: 'carmentis-wallet'});
    browser.runtime.onMessage.addListener(async (message) => {
      console.log('content received:', message);
    });

    window.addEventListener('message', async (message) => {
      console.log("Message reçu in content :", message);
      port.postMessage(message.data);
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
try {
  const CarmentisWallet = class {
      test = function () {
          console.log('This is a test message from window.carmentisWallet');
      }
      
      openPopup = function (data) {
          console.log('Input to Carmentis Wallet:', data);
          window.postMessage({ event: "input", data }, "*");
      }
  };
  
  
  if(!window.carmentisWallet) {
    window.carmentisWallet = new CarmentisWallet;
  };
} catch (e) {
  console.warn('Carmentis Wallet already defined');
}
`;

        app.append(script);

        container.append(app);
      },
    });

    ui.mount();
  }
});
