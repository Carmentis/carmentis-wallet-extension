import './style.css';
import '@/public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import * as CarmentisApp from "../../lib/carmentis-app.js"
import {browser} from "wxt/browser";

browser.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    await CarmentisApp.initialize({encryptedKey: request.data?.encryptedKey});
    console.log("event verifyEmail", sender, sendResponse);
});
/*window.addEventListener('message', async function (message) {
    console.log("message received in verifyEmail tab", message);

    //setTimeout(async () => {
        await CarmentisApp.verifyEmail(message.data, true);
    //}, 1000);
});*/



