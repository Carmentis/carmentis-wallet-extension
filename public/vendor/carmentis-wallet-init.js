try {
    const CarmentisWallet = class {
        test = function () {
            console.log('This is a test message from window.carmentisWallet');
        }

        openPopup = function (data) {
            console.log('Input to Carmentis Wallet:', data);
            window.postMessage({ function: "processQRCode", data }, "*");
        }
    };


    if(!window.carmentisWallet) {
        window.carmentisWallet = new CarmentisWallet;
    };
} catch (e) {
    console.warn('Carmentis Wallet already defined');
}
