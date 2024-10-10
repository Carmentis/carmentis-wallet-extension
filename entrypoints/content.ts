export default defineContentScript({
  matches: ['*://*/*'],
  main(ctx) {

    const port = browser.runtime.connect({name: 'carmentis-wallet'});
    console.log("[content] port created:", port)

    window.addEventListener('message', async (message) => {
      console.log("[content] message received:", message);

      // send to background
      port.postMessage(JSON.stringify({
        request: message,
        data: message.data,
        origin: message.origin
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
