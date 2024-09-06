import {browser} from "wxt/browser";
// @ts-ignore
import * as CarmentisApp from "../lib/carmentis-app.js"

export default defineBackground({
  persistent: true,
  main() {
    console.log('Hello background!', {id: browser.runtime.id});
    CarmentisApp.initialize({isBackground: true});

//    browser.storage.session.set({key: 'value'}).then(() => {

    browser.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((message) => {
        console.log('Background received:', message);

        //console.log('Background sending:', 'pong');
        //port.postMessage('pong');
        switch (message.function) {
          case "processQRCode":
            console.log("Popup request");

            browser.windows.create({
              url: './main.html',
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
            break;
          case 'verifyEmail':
            browser.tabs.create({
              url: './verifyemail.html',
            }).then((tab) => {
              console.log("Tab opened", tab);
              setTimeout(() => {
                /*const windows = browser.extension?.getViews({type: "popup"});
                if (windows.length) {
                  console.log("Closing popup");
                  //windows[0].close(); // Normally, there shouldn't be more than 1 popup
                } else {
                  console.log("There was no popup to close");
                }
                 */
                console.log("Posting message to tab ?");
                if (tab.id != null) {
                  browser.tabs.sendMessage(tab.id, {
                    function: message.function,
                    data: message.data
                  }).then((response) => {
                    console.log("Response from tab", response);
                  });
                }
              }, 1000);
            });

        }
      });
    });
  }
});
