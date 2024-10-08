import {Runtime} from "webextension-polyfill";
import Port = Runtime.Port;
import {req} from "pino-std-serializers";

function processQRCode( origin : string, data : string ) {
    browser.action.openPopup().then(() => {
        console.log("[background] open popup", data);
        setTimeout(() => {
            console.log("Sending message to popup");
            browser.runtime.sendMessage({
                action: "popup/processQRCode",
                data: data,
                origin: origin ,
            })
        }, 250);
        return true;
    }).catch( error => {
        // occurs when the popup is already opened
        browser.runtime.sendMessage({
            action: "popup/processQRCode",
            data: data,
            origin: origin,
        })
    });
}

function launchExtensionOnTab( url: string ) {
    const extensionId = browser.runtime.id;

    browser.tabs.query({}).then(allTabs => {
        for (let tab of allTabs) {
            console.log(tab)

            if (tab.url == undefined || tab.id == undefined) continue

            // check if the current page belongs to the extension
            const belongsToExtension = tab.id && tab.url && tab.url.includes(extensionId);
            if (!belongsToExtension) {
                continue
            }

            // if the current page corresponds to extension but is not the desired URL, close it
            if (!tab.url.includes(url)) {
                browser.tabs.remove(tab.id);
                continue
            }

            // the desired entrypoint is already open, so focus it
            browser.tabs.update(tab.id, {active: true});
            return

        }

        // otherwise open a new tab for it
        browser.tabs.create({
            url: url
        })
    })


    }

    export default defineBackground({
        persistent: true,
        main: () => {
            console.log('background executed');

            browser.runtime.onInstalled.addListener(({reason}) => {
                if ( reason === "install" ) {
                    browser.tabs.create({url: "./main.html"});
                }
                return true;
            });


            browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
                console.log("[background] message received:", message, sender, sendResponse);

                // we do not execute request coming from tab which are not active
                if ( sender.tab && !sender.tab.active ) { return }


                if (message.action == "open") {
                    if (message.location == "main") {
                        //launchExtensionOnTab( "./main.html" );
                        browser.tabs.create({url: "./main.html"});
                        // browser.tabs.create({url: "./main.html"});
                    }

                    if (message.location == "onboarding") {
                        browser.tabs.create({url: "./main.html"});
                    }
                }
            });


             browser.runtime.onConnect.addListener((port:Port) => {
                 console.log("[background] connected to: ", port);
                 port.onMessage.addListener((request) => {
                     console.log("[background] message received from port:", request);
                     const message = request.data
                     if (message.action === "processQRCode") {
                         // get the data section
                         let QRCodeData = message.data;
                         processQRCode(request.origin, QRCodeData)

                     } else {
                         console.warn("[background] undefined action: I don't known the desired action: received message: ", message);
                     }
                     return true;
                 })
             });
        }
    });
