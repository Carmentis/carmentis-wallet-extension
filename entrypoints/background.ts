
function launchExtensionOnTab() {
  const extensionId = browser.runtime.id;

  browser.tabs.query({}).then((allTabs) => {
    // if a tab is already opened for the extension, focus it
    for (let tab of allTabs) {
      if (tab.id && tab.url && tab.url.includes(extensionId)) {
        browser.tabs.update(tab.id, {active: true});
        return
      }
    }

    // otherwise open a new tab for it
    browser.tabs.create({
      url: "./initialisation.html"
    })
  });



}

export default defineBackground({
  persistent: true,
  main: () => {
    console.log('background executed');

    browser.runtime.onInstalled.addListener(({reason}) => {
      if ( reason === "install" ) {
        browser.tabs.create({url: "./initialisation.html"});
      }
    })


    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action == "new-tab") {
        launchExtensionOnTab()
      } else {
        console.error(`undefined required action: ${message.action}`)
      }


    })


  }
});
