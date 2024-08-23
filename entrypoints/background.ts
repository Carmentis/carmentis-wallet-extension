import {browser} from "wxt/browser";
// @ts-ignore
import * as CarmentisApp from "../lib/carmentis-app.js"

export default defineBackground({
  persistent: true,
  main() {
    console.log('Hello background!', {id: browser.runtime.id});
    CarmentisApp.initialize();

//    browser.storage.session.set({key: 'value'}).then(() => {

    browser.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((message) => {
        console.log('Background received:', message);

        //console.log('Background sending:', 'pong');
        //port.postMessage('pong');
        if (message.function !== undefined) {
          console.log("Popup request");

          browser.windows.create({
            url: './popup.html',
            type: 'popup',
            width: 400,
            height: 600,
            left: 0,
            top: 0,
            focused: true
          }).then(() => {
            console.log("Popup opened", message.data);
            if(message.data !== undefined) {
              setTimeout(() => {
                console.log("Sending message to popup");
                browser.runtime.sendMessage({
                  function: message.function,
                  data: message.data
                });
              }, 1000);
            }
          });
        }
      });
    });
  }
});
