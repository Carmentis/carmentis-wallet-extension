export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {

    const port = browser.runtime.connect({name: 'carmentis-wallet'});

    window.addEventListener('message', async (message) => {
      console.log("[content] message received:", message);

      //sent to background
      port.postMessage({
        request: message,
        data: message.data,
        origin: message.origin
      });
    });


    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: (container) => {
        console.log('Carmentis Wallet mounted');
        //const wallet = retrieveWallet();
        // Append children to the container
        const app = document.createElement('p');
        app.textContent = 'Carmentis Wallet installed';

        const script = document.createElement('script');
        script.type = 'module'; // Optional, if using ES6 modules
        script.src = browser.runtime.getURL('/vendor/carmentis-wallet-init.js');
        container.append(script);

      },
    });

    ui.mount();
  },
});
