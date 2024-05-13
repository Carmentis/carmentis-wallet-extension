import {browser} from "wxt/browser";


export default defineBackground({
    persistent: true,
    main() {
        console.log('Hello background!', {id: browser.runtime.id});

        browser.runtime.onConnect.addListener((port) => {
            port.onMessage.addListener((message) => {
                console.log('Background received:', message);

                if (message.event === "openPopupRequest") {
                    console.log("Popup request")
                    browser.windows.create({
                        url: './popup.html',
                        type: 'popup',
                        width: 400,
                        height: 600,
                        left: 0,
                        top: 0,
                        focused: true,
                        titlePreface: 'Carmentis Wallet',
                    }).then(() => {
                        console.log("Popup ouvert");
                    });
                    return 'Popup ouvert';
                }
            });
        });

        browser.runtime.onMessage.addListener( (message) => {
            console.log("Message reçu in bg :", message)
        });
    }
});
