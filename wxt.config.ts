import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
    runner: {
      binaries: {
        chrome: '/Applications/Brave\\ Browser.app/Contents/MacOS/Brave\\ Browser',
        firefox: '/Applications/Firefox.app/Contents/MacOS/firefox',
      }
    },
    //externally_connectable: {
    //  matches: ['*://*/*'],
    //}
  }),
  manifest: {
    host_permissions: ['*://*/*'],
    browser_action: {},
    permissions: ['storage', 'tabs'],
    web_accessible_resources: ['carmentis-wallet.js']
  }
});
