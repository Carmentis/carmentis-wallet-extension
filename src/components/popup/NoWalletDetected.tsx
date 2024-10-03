
export function NoWalletDetected() {

    function goToWalletCreation() {
        browser.runtime.sendMessage({
            action: "open",
            location: "main"
        })
    }

    function goToDocumentation()  {
        const action = window.open("https://docs.carmentis.io/", '_blank');
        if (action) {
            action.focus();
        }
    }

    return <>
        <div className="content p-4">
            <h1>Create an account</h1>

            <p>It appears that you do not have a wallet yet. To create your wallet, click on the button
                below. </p>

            <div className="flex items-center justify-center mt-4">

                <button className="btn-primary btn-highlight" onClick={goToWalletCreation}>Create a wallet</button>
            </div>

            <hr className="mt-4 mb-4"/>

            <h1>Learn more about wallet</h1>

            <p>You want to learn more about the wallet provided by Carmentis ? Feel free to read our documentation.
            </p>

            <div className="flex items-center justify-center mt-4">

                <button className="btn-primary" onClick={goToDocumentation}>Learn more</button>
            </div>
        </div>

    </>;
}