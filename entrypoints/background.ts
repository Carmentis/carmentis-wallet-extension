import {useWallet} from "@/hooks/useWallet.tsx";
import {CarmentisProvider} from "@/providers/CarmentisProvider.ts";
import {browser} from "wxt/browser";


export default defineBackground({
    persistent: true,
    main() {
        /*browser.browserAction.openPopup().then(() => {
            //console.log("Popup ouvert");
        });*/
        console.log('Hello background!', {id: browser.runtime.id});

        /*browser.runtime.onMessageExternal.addListener(async (message) => {
            console.log("Message reçu in background :", message)
            // Assurez-vous que le message vient de la source attendue
            if (message === "openPopupRequest") {
                browser.browserAction.openPopup().then(() => {
                    console.log("Popup ouvert");
                });
                return 'Popup ouvert';
            }
            return 'Message non reconnu';
        });*/

        browser.runtime.onConnect.addListener((port) => {
            port.onMessage.addListener((message) => {
                console.log('Background received:', message);

                //console.log('Background sending:', 'pong');
                //port.postMessage('pong');
                if (message.event === "openPopupRequest") {
                    console.log("Popup request")
                    browser.windows.create({
                        url: './popup.html',
                        type: 'popup',
                        width: 400,
                        height: 600,
                        left: 0,
                        top: 0,
                    }).then(() => {
                        console.log("Popup ouvert");
                    });
                    return 'Popup ouvert';
                }
            });
        });


            browser.runtime.onMessage.addListener( (message) => {
            console.log("Message reçu in bg :", message)
            // Assurez-vous que le message vient de la source attendue
            /*browser.runtime.sendMessage(event.data).then((response) => {
                console.log('Popup response:', response);
            });*/
            alert("Message reçu in bg :" + message)
        });
    }
});
