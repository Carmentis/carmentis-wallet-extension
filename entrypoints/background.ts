import {windows} from "webextension-polyfill";

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
                    browser.tabs.create({url: "./initialisation.html"});
                }
            });


            browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
                console.log("[background] message received:", message, sender, sendResponse);
                if (message.action == "open") {
                    if (message.location == "main") {
                        launchExtensionOnTab( "./main.html" );
                        // browser.tabs.create({url: "./main.html"});
                    }

                    if (message.location == "onboarding") {
                        browser.tabs.create({url: "./initialisation.html"});
                    }
                }
            });
        }
    });
