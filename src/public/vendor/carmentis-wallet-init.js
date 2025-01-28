try {
    console.log("Landing of the wallet on the page...")
    const CarmentisWallet = class {
        openPopup = function (data) {
            console.log('Input to Carmentis Wallet:', data);
            window.postMessage({ action: "processQRCode", data }, "*");
        }
    };
    console.log("Landing of the wallet on the page..", CarmentisWallet)


    if(!window.carmentisWallet) {
        window.carmentisWallet = new CarmentisWallet;
    };

    console.log("Landing of the wallet on the page...", window)
} catch (e) {
    console.warn('Carmentis Wallet already defined');
}
