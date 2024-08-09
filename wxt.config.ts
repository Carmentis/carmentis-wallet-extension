import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        host_permissions: ['*://*/*'],
        browser_action: {},
        permissions: ['storage', 'tabs']
    }
});
