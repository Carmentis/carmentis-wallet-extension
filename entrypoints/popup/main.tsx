import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';

console.log("main.tsx from popup called")

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
            url: "../initialisation.html"
        })
    });
}


launchExtensionOnTab();

if (false) {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>,
    );

}