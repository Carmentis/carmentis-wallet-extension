import './style.css';
import '@/public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import * as CarmentisApp from "../../lib/carmentis-app.js"
import {browser} from "wxt/browser";

browser.tabs.create({
    url: './main.html',
}).then((tab) => {
    console.log("Tab opened", tab);
    window.close();
});


