try {
    const CarmentisWallet = class {
        openPopup = function (data) {
            console.log('Input to Carmentis Wallet:', data);
            window.postMessage({ action: "processQRCode", data }, "*");
        }
    };


    if(!window.carmentisWallet) {
        window.carmentisWallet = new CarmentisWallet;
    };
} catch (e) {
    console.warn('Carmentis Wallet already defined');
}
