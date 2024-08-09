import {browser} from "wxt/browser";


export default defineBackground({
  persistent: true,
  main() {
    console.log('Hello background!', {id: browser.runtime.id});

    browser.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener((message) => {
        console.log('Background received:', message);

        //console.log('Background sending:', 'pong');
        //port.postMessage('pong');
        if (message.event === "input") {
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
  }
});
