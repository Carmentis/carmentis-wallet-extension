import './style.css';
import '@/public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import * as CarmentisApp from "../../lib/carmentis-app.js"
import {browser} from "wxt/browser";

console.log("Carmentis Wallet initializing...");
CarmentisApp.initialize().then(r => {
    console.log("Carmentis Wallet initialized");
});


