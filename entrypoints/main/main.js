import '@/public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import * as CarmentisApp from "../../lib/carmentis-app.js"

console.log("Carmentis Wallet initializing...");
CarmentisApp.initialize().then(r => {
    console.log("Carmentis Wallet initialized");
});


