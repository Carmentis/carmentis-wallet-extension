try {
    console.log("Landing of the wallet on the page...")
    const CarmentisWallet = class {
        openPopup = async function (data) {
            console.log('Input to Carmentis Wallet:', data);
            window.postMessage({
                action: "carmentis/clientRequest",
                request: data,
                from: 'carmentis-wallet-init.js'
            }, "*"
            );
        }
    };
    console.log("Landing of the wallet on the page..", CarmentisWallet)


    if(!window.carmentisWallet) {
        window.carmentisWallet = new CarmentisWallet;
    };
} catch (e) {
    console.warn('Carmentis Wallet already defined');
}
