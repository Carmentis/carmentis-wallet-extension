import {browser} from "wxt/browser";

export default defineContentScript({
    matches: ['*://*/*'],
    async main(ctx) {
        console.log('Hello content.');

        const port = browser.runtime.connect({ name: 'example' });
        port.onMessage.addListener((message) => {
            console.log('content received:', message);
        });

        window.addEventListener('message', async (event) => {
            console.log("Message reçu in content :", event)
            // Assurez-vous que le message vient de la source attendue
            /*browser.runtime.sendMessage(event.data).then((response) => {
                console.log('Popup response:', response);
            });*/
            //port.postMessage("openPopupRequest");
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
                // Append children to the container
                const app = document.createElement('p');
                app.textContent = 'Carmentis Wallet installed';
                container.append(app);
            },
        });

        // Call mount to add the UI to the DOM
        ui.mount();
    },
});
