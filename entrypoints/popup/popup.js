import {browser} from "wxt/browser";

browser.tabs.create({
    url: './main.html',
}).then((tab) => {
    console.log("Tab opened", tab);
    window.close();
});


