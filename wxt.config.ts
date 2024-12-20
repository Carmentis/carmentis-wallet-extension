import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Carmentis Wallet',
    version: '0.7.2',
    description: 'Carmentis Wallet',
    host_permissions: ['*://*/*'],
    browser_action: {},
    permissions: [
      'storage',
    ],
    web_accessible_resources: [{
      resources: ['vendor/carmentis-wallet-init.js'],
      matches: ['<all_urls>'],
    }],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';"
    }
  }
});
