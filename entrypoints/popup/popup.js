import {browser} from "wxt/browser";

browser.storage.local.get(['openedTabId'], function(result) {
    const previousTabId = result.openedTabId;

    if (previousTabId) {
        browser.tabs.remove(previousTabId, function() {
            // Ouvre un nouvel onglet après avoir fermé l'ancien
            browser.tabs.create({ url: url }, function(newTab) {
                // Stocke l'ID du nouvel onglet
                browser.storage.local.set({ openedTabId: newTab.id });
            });
        });
    }

    browser.tabs.create({
        url: './main.html',
    }).then((newTab) => {
        window.close();
        browser.storage.local.set({ openedTabId: newTab.id });
        console.log("Tab opened", newTab);
    });
});



