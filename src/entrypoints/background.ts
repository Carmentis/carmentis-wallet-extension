


export enum BACKGROUND_REQUEST_TYPE {
    CLIENT_REQUEST = "clientRequest",
    CLIENT_RESPONSE = "clientResponse",
    BROWSER_OPEN_ACTION = "browserAction"
}

export enum CLIENT_REQUEST_TYPE {
    AUTHENTICATION = "authentication"
}


export type BrowserActionPayload = {
    location: "main" | "onboarding"
}


export type BackgroundRequest<T> = {
    backgroundRequestType: BACKGROUND_REQUEST_TYPE,
    source?: string,
    payload: T
}



export type ClientRequestPayload<T> = {
    clientRequestType: CLIENT_REQUEST_TYPE,
    timestamp: number,
    origin: string,
    data: T
}

export type ClientResponsePayload<T> = {
    clientRequestType: CLIENT_REQUEST_TYPE,
    data: T
}

export type ClientAuthenticationRequest = ClientRequestPayload<{challenge: string}>
export type ClientAuthenticationResponse = ClientResponsePayload<{publicKey: string, signature: string}>


export type ClientResponse = {
    answer: string,
    answerType: number,
}

export type QRDataClientRequest = {
    timestamp: number,
    origin: string,
    data: QRCodeRequestData
}

export type QRCodeRequestData  = {
    requestType: number,
    request: string
}


function debounce(func: any, delay: number) {
    let timer: any;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}



function forwardClientRequest(request: QRDataClientRequest) {
    async function notifyExtension() {
        try {
            console.log("Attempting to open the extension...")
            await browser.action.openPopup()
            console.log("Extension open!")
        } catch (e) {
            console.log("Cannot open the extension:", e)
        }

        const trySending = (retryCount: number) => {
            // Envoyer le message
            browser.runtime.sendMessage(request)
                .then(() => console.log("Message sent to extension"))
                .catch((error) => {
                    console.warn(`Try ${retryCount} failed :`, error);
                    if (retryCount <= 0) {
                        console.error("Extension non disponible après plusieurs tentatives.");
                    } else {
                        setTimeout(() => trySending(retryCount - 1), 100);
                    }
                });
        };

        trySending(10)
    }

    notifyExtension()
}

function forwardRequestToFront(request: BackgroundRequest<ClientResponse>) {
    browser.tabs
        .query({
            currentWindow: true,
            active: true,
        })
        .then(tabs => {
            console.log("[background] tabs:", tabs)
            if (tabs.length !== 0) {
                const id = tabs[0].id as number;
                browser.tabs.sendMessage(id, request.payload)
            }

        })
}
const bouncedFormatRequestToFront = debounce(forwardRequestToFront, 500)

export default defineBackground({
    persistent: true,
    main: () => {
        console.log('background executed');

        browser.runtime.onInstalled.addListener(({reason}) => {
            console.log("[background] onInstalled:", reason)
            if (reason === "install") {
                browser.tabs.create({url: "./main.html"});
            }
            return true;
        });


        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("[background] onMessage:", message)

            const request = message as BackgroundRequest<unknown>;

            if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.BROWSER_OPEN_ACTION) {
                console.log("[background] receiving browser action:", message);
                const payload = request.payload as BrowserActionPayload;
                if (payload.location == "main") {
                    browser.tabs.create({url: "./main.html"});
                }

                if (payload.location == "onboarding") {
                    browser.tabs.create({url: "./main.html"});
                }
            } else if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.CLIENT_REQUEST) {
                console.log("[background] handling client request", request)
                const clientRequest = request as BackgroundRequest<QRDataClientRequest>;
                forwardClientRequest(clientRequest.payload)
            } else if (request.backgroundRequestType == BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE) {
                console.log("[background] handling client response", request)
                bouncedFormatRequestToFront(request)
            } else {
                console.warn("[background] unknown request:", request)
            }



            sendResponse({success: true});
            return true;
        });
    }
});
