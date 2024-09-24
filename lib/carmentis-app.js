import * as Carmentis from "./carmentis-nodejs-sdk.js";
import * as storage   from "./storage.js";
import {browser}      from "wxt/browser";
import {getMicroChain, loadFromMicrochain} from "./carmentis-nodejs-sdk.js";


const CST     = Carmentis.core.constants;
const dom     = Carmentis.web.dom;
const helpers = Carmentis.core.util.helpers;
const uint8   = Carmentis.core.util.uint8;

const VERSION    = "0.2";
const APP_WIDTH  = 355;
const APP_HEIGHT = 711;
const N_WORDS    = 12;

const DB_VERSION = 2;

let user, application, flow, processedRecord, db, ws, historyData, isBackground = false;

browser.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log("onMessage", request);
        switch (request?.function) {
            case "processQRCode":
                await processQRCode(request.data);
                break;
            /*case "verifyEmail":
                await verifyEmail(request.data, true);
                break;*/
            case "refreshHistory":
                if(!isBackground) {
                    await history();
                }
                break;
            default:
                throw new Error("Unknown function: " + request.function);
        }
    }
);

// ============================================================================================================================ //
//  initialize()                                                                                                                //
// ============================================================================================================================ //
export async function initialize(options = {}) {
    console.log("*********************************************************************  initialize", options)

    if(options.isBackground) {
        isBackground = true;
    }

    application = {
        seed          : null,
        config        : null,
        accounts      : [],
        currentAccount: 0
    };
    const n = 0;

    await setUser(n);

    await initDB();

    if(options.encryptedKey !== undefined) {
        console.log("encryptedKey", options.encryptedKey);
        console.log(await Carmentis.deriveAesKeyFromBits(uint8.fromHexa(options.encryptedKey)));
        storage.setKey(await Carmentis.deriveAesKeyFromBits(uint8.fromHexa(options.encryptedKey)));

        await retrieveConfig();

        if(!await retrieveSeed()) {
            console.log("error: seed null");
        } else {
            initializeUi(options);
        }
    }else{
        console.log("no encryptedKey");
        await retrieveConfig();
        window.addEventListener("load", _ => initializeUi(options));
        await Carmentis.wallet.setRequestCallback(processClientRequest, processServerRequest);
        await Carmentis.wallet.attemptToReconnect();
    }

    if(isBackground) {
        initWS();
    }
}

async function initDB() {
    const rdb = window.indexedDB.open("carmentis-wallet", DB_VERSION);

    rdb.onsuccess = function (event) {
        db = event.target.result;
    }

    rdb.onerror = function (event) {
        alert("Database error: " + event?.target?.errorCode);
    };

    rdb.onupgradeneeded = function (event) {
        db = event.target.result;

        const objectStore = db.createObjectStore("microblocks", { keyPath: "hash" });
        objectStore.createIndex("microchainId", "microchainId", { unique: false });
        objectStore.createIndex("ts", "ts", { unique: false });

        objectStore.transaction.oncomplete = function (event) {
            console.log("DbTransaction oncomplete");
        };
    };
}

function getMicroblocksOrderedByTimestamp(callback) {
    const transaction = db.transaction(['microblocks'], 'readonly');
    const store = transaction.objectStore('microblocks');

    const index = store.index('ts');
    const request = index.getAll();

    request.onsuccess = function(event) {
        callback((request.result).reverse());
    };

    request.onerror = function(event) {
        console.error('Erreur de récupération des transactions triées par timestamp:', event);
    };
}

function initWS() {
    if(!application.config?.nodeEndpoint) {
        console.log("[ws] No node endpoint defined or known. Doing nothing.");
        return;
    }
    if(ws) {
        ws.close();
    }

    ws = new WebSocket(
        application.config.nodeEndpoint
            .replace('http://', 'ws://')
            .replace('https://', 'wss://')
        + '/websocket'
    );

    ws.onopen = () => {
        console.log('[ws] opened');
        const msg = JSON.stringify({
            jsonrpc: "2.0",
            method: "subscribe",
            params: ["tm.event='Tx'"],
            id: 0
        });
        ws.send(msg);
    };

    ws.onclose = () => {
        console.log('[ws] closed');

        initWS();
    };

    ws.onerror = (error) => {
        console.log('[ws] error:', error);
    };

    ws.onmessage = (event) => {
        console.log('[ws] message received:', event.data);

        const data = JSON.parse(event.data);

        if (data.result && data.result.events && data.result.events['microblock.hash']) {
            const microblockEvent = {
                hash: data.result.events['tx.hash'][0],
                microchain: data.result.events['microblock.microchain'][0],
                nonce: data.result.events['microblock.nonce'][0],
            };

            console.log('Microblock event reçu :', microblockEvent);

            const dbTransaction = db.transaction(["microblocks"], "readwrite");
            const objectStore = dbTransaction.objectStore("microblocks");

            const request = objectStore.get(microblockEvent.hash);

            request.onsuccess = function(event) {
                const microblock = request.result;
                if(microblock) {
                    microblock.microchain = microblockEvent.microchain;
                    microblock.nonce = microblockEvent.nonce;
                    microblock.status = "Anchored";
                    microblock.ts = (new Date()).getTime();

                    objectStore.put(microblock);

                    window.postMessage({ function: "refreshHistory", data }, "*");
                }
            }
        } else {
            console.log('Autre message reçu :', data);
        }
    };
}

// ============================================================================================================================ //
//  initializeUi()                                                                                                              //
// ============================================================================================================================ //
function initializeUi(options) {
    let body = dom.elementToObject(document.body),
        position = options.position == "bottomLeft" ? "bottom_left" : "bottom_right";

    let styleLink = document.createElement("link");

    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = "assets/debug-app/css/style.css";
    document.getElementsByTagName("head")[0].appendChild(styleLink);


    // phone
    body.append(
        dom.create("div", "_app_wrapper").append(
            dom.create("div", "_app_header").append(
                dom.create("div", "_app_user").append(
                    icon("person-circle"),
                    dom.create("span")
                ).click(changeUser),
                dom.create("div", "_app_restart").append(
                    icon("arrow-clockwise")
                ).click(start),
            ),

            dom.create("div", "_app_screen").append(
                dom.create("div", "_app_over"),
                dom.create("div", "_app_content")
            ),

            dom.create("div", "_app_footer").append(
                dom.create("div", "_app_back").append(
                    icon("chevron-left")
                )
                    .click(_ => application.backCallback && application.backCallback())
            )
        )
    );

    let shown = 0,
        running = false;

    let appWrapper = dom.get("#_app_wrapper");

    let drag = {
        move: false
    };

    dom.get("#_app_header").event("mousedown", function(e) {
        if(e.target.id == "_app_header") {
            drag.move = true;
            document.body.classList.add("no-select");
            drag.initX = e.offsetX;
            drag.initY = e.offsetY;
        }
    })

    dom.elementToObject(document).event("mousemove", function(e) {
        if(drag.move) {
            appWrapper.style({
                left: Math.min(Math.max(0, e.clientX - drag.initX), window.innerWidth  - APP_WIDTH ) + "px",
                top : Math.min(Math.max(0, e.clientY - drag.initY), window.innerHeight - APP_HEIGHT) + "px"
            });
        }
    });

    appWrapper.event("mouseup", function() {
        drag.move = false;
        document.body.classList.remove("no-select");
    })

    function changeUser() {
        setUser(user ^= 1);
        start();
    }

    function close() {
        shown = 0;
        dom.get("#_app_wrapper").hide();
    }

    function showApplication() {
        shown ^= 1;
        dom.get("#_app_wrapper").show(shown);

        if(shown && !running) {
            running = true;
            start(
                options.encryptedKey ? "verifyEmail" : null
            );
        }
    }

    showApplication();
}

// ============================================================================================================================ //
//  setUser()                                                                                                                   //
// ============================================================================================================================ //
async function setUser(n) {
    user = n;
    storage.setUser(n);
}

// ============================================================================================================================ //
//  start()                                                                                                                     //
// ============================================================================================================================ //
async function start(startPageName=null) {
    screenSet(
        null,
        dom.create("div", "_app_splash").append(
            dom.create("div").text("version " + VERSION)
        )
    );
    let startPage;

    switch(startPageName) {
        case 'verifyEmail':
            startPage = verifyEmail;
            break;
        default:
            startPage = (await storage.exists("seed")) ? askPassword : createPassword;
            break;
    }


    setTimeout(startPage, 1500);
}

// ============================================================================================================================ //
//  askPassword()                                                                                                               //
// ============================================================================================================================ //
function askPassword() {
    screenSet(
        null,
        title("Enter your password"),

        dom.create("p").className("_app_center").text("Please enter your password to unlock your wallet."),
        dom.create("input", "_app_pwd").setAttribute("type", "password").event("input", _ => dom.get("#_app_error").style({ visibility: "hidden" })),
        dom.create("p", "_app_error").className("_app_center _app_error").text("invalid password").style({ visibility: "hidden" }),

        dom.create("button").text("Submit").click(submit)
    );

    async function submit() {
        let pwd = dom.get("#_app_pwd").el.value,
            passwordKey = await Carmentis.deriveAesKeyFromPassword(pwd);

        storage.setKey(passwordKey);

        await retrieveConfig();

        let seed = await retrieveSeed();

        if(!seed) {
            dom.get("#_app_error").style({ visibility: "visible" });
        }
        else {
            home();
        }
    }
}

// ============================================================================================================================ //
//  retrieveConfig()                                                                                                            //
// ============================================================================================================================ //
async function retrieveConfig() {
    //let config = await storage.readJson("config");

    let config = false;

    if(!config) {
      config = {
        nodeEndpoint: "https://node.testapps.carmentis.io",
        dataEndpoint: "https://data.testapps.carmentis.io"
      };
    }

    application.config = config;
    applyConfig();

    return config;
}

// ============================================================================================================================ //
//  applyConfig()                                                                                                               //
// ============================================================================================================================ //
function applyConfig() {
  Carmentis.registerNodeEndpoint(application.config.nodeEndpoint);
  Carmentis.registerDataEndpoint(application.config.dataEndpoint);

}

// ============================================================================================================================ //
//  retrieveSeed()                                                                                                              //
// ============================================================================================================================ //
async function retrieveSeed() {
    let seed = await storage.read("seed");

    if(seed) {
        await loadAccounts();
        application.seed = seed;
    }
    return seed;
}

// ============================================================================================================================ //
//  createPassword()                                                                                                            //
// ============================================================================================================================ //
function createPassword() {
    screenSet(
        null,
        title("Choose a password"),

        dom.create("p").className("_app_center").text("Choose a password to protect your wallet."),
        dom.create("input", "_app_pwd1").setAttribute("type", "password").event("input", checkForm),
        dom.create("p").className("_app_center _app_mt16").text("Confirm your password."),
        dom.create("input", "_app_pwd2").setAttribute("type", "password").event("input", checkForm),
        checkbox(
            "_app_agree",
            `I understand that Carmentis cannot help me recover my password (<a href="#" id="_app_learn">learn more</a>).`,
            checkForm
        ),
        dom.create("button", "_app_ok").text("Submit").click(submit).disabled(true)
    );

    function checkForm() {
        let pwd1 = dom.get("#_app_pwd1").el.value,
            pwd2 = dom.get("#_app_pwd2").el.value,
            agreed = dom.get("#_app_agree").el.checked;

        dom.get("#_app_ok").disabled(pwd1 == "" || pwd2 != pwd1 || !agreed);
    }

    async function submit() {
        let pwd = dom.get("#_app_pwd1").el.value,
            passwordKey = await Carmentis.deriveAesKeyFromPassword(pwd);

        storage.setKey(passwordKey);
        await retrieveConfig();
        askPrivateKey();
    }

    dom.get("#_app_learn").click(aboutSecurity);
}

// ============================================================================================================================ //
//  askPrivateKey()                                                                                                             //
// ============================================================================================================================ //
function askPrivateKey() {
    screenSet(
        null,
        title("Private key"),

        dom.create("p").text("No private key is currently stored in your wallet."),
        dom.create("p").text("You may either create a new key or import an existing one."),
        dom.create("button").text("Create").click(createPassphrase),
        dom.create("button").text("Import").click(importPassphrase)
    );
}

// ============================================================================================================================ //
//  createPassphrase()                                                                                                          //
// ============================================================================================================================ //
function createPassphrase() {
    application.wordList = Carmentis.generateWordList(N_WORDS);
    showPassphrase(checkPassphrase, false, true);
}

// ============================================================================================================================ //
//  showPassphrase()                                                                                                            //
// ============================================================================================================================ //
function showPassphrase(nextCallback, agreed, showCheckbox) {
    screenSet(
        null,
        title("Your passphrase"),

        dom.create("p").text("Store your passphrase securely in different locations. Never share it with anyone."),

        dom.create("table").className("_app_passphrase_table").append(
            ...[...Array(N_WORDS / 3).keys()].map(y =>
                dom.create("tr").append(
                    ...[ 0, 1, 2 ].map(x => dom.create("td").text(application.wordList[y * 3 + x]))
                )
            )
        ),

        dom.create("p").className("_app_center _app_mt16").append(
            dom.create("a").setAttribute("href", "#").html(`<i class="bi bi-copy"></i> Copy the passphrase`)
                .click(e => {
                    e.preventDefault();
                    navigator.clipboard.writeText(application.wordList.join(" "));
                })
        ),

        ...showCheckbox ?
            [
                checkbox(
                    null,
                    `I understand that Carmentis cannot help me recover my passphrase (<a href="#" id="_app_learn">learn more</a>).`,
                    checked => dom.get("#_app_ok").disabled(!checked),
                    agreed
                )
            ]
            :
            [
                dom.create("p").html(
                    `Remainder: Carmentis cannot help you recover your passphrase (<a href="#" id="_app_learn">learn more</a>).`
                )
            ],
        dom.create("button", "_app_ok").text("OK").click(nextCallback).disabled(!agreed)
    );

    dom.get("#_app_learn").click(aboutSecurity);
}

// ============================================================================================================================ //
//  checkPassphrase()                                                                                                           //
// ============================================================================================================================ //
async function checkPassphrase() {
    let missing = [...Array(N_WORDS).keys()];

    for(let i = N_WORDS; --i;) {
        let j = Math.random() * (i + 1) | 0;
        [ missing[i], missing[j] ] = [ missing[j], missing[i] ];
    }

    missing = missing.slice(0, 3);

    screenSet(
        null,
        title("Confirm your passphrase"),

        dom.create("p").className("_app_center").text("Please fill in the missing words."),

        dom.create("table").className("_app_passphrase_table").append(
            ...[...Array(N_WORDS / 3).keys()].map(y =>
                dom.create("tr").append(
                    ...[ 0, 1, 2 ].map(x => {
                        let el = dom.create("td"),
                            ndx = y * 3 + x;

                        if(missing.includes(ndx)) {
                            el.append(
                                dom.create("input", "_app_w" + ndx).className("_app_missing_word").setAttribute("maxlength", 8).event("input", check)
                            );
                        }
                        else {
                            el.text(application.wordList[ndx]);
                        }
                        return el;
                    })
                )
            )
        ),

        dom.create("button", "_app_ok").text("OK").click(success).disabled(true),

        dom.create("p").className("_app_center _app_mt16").append(
            dom.create("a").setAttribute("href", "#").html(`<i class="bi bi-eye"></i> Show the passphrase again`)
                .click(e => {
                    e.preventDefault();
                    showPassphrase(checkPassphrase, true, true);
                })
        )
    );

    function check() {
        dom.get("#_app_ok").disabled(
            missing.some(ndx =>
                dom.get("#_app_w" + ndx).el.value.trim().toLowerCase() != application.wordList[ndx]
            )
        );
    }

    async function success() {
        if(await saveSeed(application.wordList)) {
            home();
        }
    }
}

// ============================================================================================================================ //
//  importPassphrase()                                                                                                          //
// ============================================================================================================================ //
function importPassphrase() {
    screenSet(
        null,
        title("Your passphrase"),

        dom.create("p").className("_app_center").text("Please enter your passphrase below."),
        dom.create("textarea", "_app_data").style({ height: "110px" }),
        dom.create("button").text("OK").click(submit)
    );

    async function submit() {
        let words = dom.get("#_app_data").el.value.trim().split(/\s+/);

        if(await saveSeed(words)) {
            home();
        }
    }
}

// ============================================================================================================================ //
//  saveConfig()                                                                                                                //
// ============================================================================================================================ //
async function saveConfig() {
    try {
        await storage.writeJson("config", application.config);

        return true;
    }
    catch(e) {
        return false;
    }
}

// ============================================================================================================================ //
//  saveSeed()                                                                                                                  //
// ============================================================================================================================ //
async function saveSeed(words) {
    try {
        let seed = await Carmentis.getSeedFromWordList(words);

        await storage.write("seed", seed);

        application.seed = seed;
        return true;
    }
    catch(e) {
        return false;
    }
}

// ============================================================================================================================ //
//  home()                                                                                                                      //
// ============================================================================================================================ //
function home() {
    if(!application.accounts.length) {
        editAccountName(0);
        return;
    }

    const menu = [
       // [ "Scan",       "qr-code-scan", scan        ],
        [ "Accounts",   "person",       accountList ],
        [ "Parameters", "gear",         parameters  ]
    ];

    screenSet(
        null,
        title("Welcome"),

        dom.create("p").className("_app_center").text(`Account #${application.currentAccount + 1} - ${application.accounts[application.currentAccount].name}`),

        dom.create('div', '_app_history').text('History'),

        dom.create("div", "_app_menu").append(
            ...menu.map(([ title, iconName, callback ]) =>
                dom.create("div").className("_app_menu_item").append(
                    dom.create("div").append(
                        icon(iconName)
                    ),
                    dom.create("div").text(title)
                )
                    .click(callback)
            )
        )
    );

    getMicroblocksOrderedByTimestamp((microblocks) => {
        historyData = microblocks;

        dom.get('#_app_history').append(
            dom.create("div", "_app_history_item").className("list-group").append(
                dom.create("ul", "_app_history_list").className("list-group")
            )
        )

        microblocks.forEach((microblock) => {

            const dataToDisplay = [
                { label: "Microchain", value: microblock.microchain },
                { label: "Nonce", value: microblock.nonce },
                { label: "Status", value: microblock.status },
                { label: "Timestamp", value: (new Date(microblock.ts)).toLocaleString() }
            ]

            dom.get("#_app_history_list").append(
                dom.create("li", "_app_history_item_"+microblock.hash)
                    .className("list-group-item")
                    .setAttribute('style', 'cursor: pointer;')
                    .append(
                        ...dataToDisplay.map(({ label, value }) => dom.create("div").append(
                            dom.create("span").text(label + ": "),
                            dom.create("span").text(value)
                        ))
                    ).click(_ => displayMicrochainDetails(microblock))
            );
        });
    });
}

async function displayMicrochainDetails(microblock) {
    const mc = await loadFromMicrochain(microblock.microchain);
    flow = mc;

    const blocksOfChain = mc.flowObject.chain.microBlock;
    const carouselData = [];

    blocksOfChain.forEach((block) => {
        console.log('block', block);
        carouselData.push(
            {
                hash: uint8.toHexa(block.hash),
                microchain: uint8.toHexa(block.microChainId),
                nonce: block.nonce,
                status: block.status,
                timestamp: (new Date(block.ts * 1000)).toLocaleString()
            }
        )
    });

    const carouselBody = dom.get(".carousel-inner");
    carouselBody.clear();

    dom.get('#microblockModalTitle').clear();

    dom.get('#microblockModalTitle').append(
            dom.create("h5").text("µChain: ").append(
                dom.create('a')
                    .setAttribute('href', 'https://data.testapps.carmentis.io/explorer/microchain/0x' + microblock.microchain)
                    .setAttribute('target', '_blank')
                    .text(" " + uint8.formatHash(uint8.fromHexa(carouselData[0].microchain), 8))
            ),
    );

    for (const datum of carouselData.reverse()) {
        const datumInDom = dom.create("div").append(
            dom.create("p").text("µBlock #" + datum.nonce),
            dom.create("p").text("Hash: ").append(
                dom.create('a')
                    .setAttribute('href', 'https://data.testapps.carmentis.io/explorer/microblock/0x' + microblock.hash)
                    .setAttribute('target', '_blank')
                    .text(" " + uint8.formatHash(uint8.fromHexa(microblock.hash), 8))
            )
        );

        const e = dom.create("div")
            .className('carousel-item')
            .append(
                datumInDom
            );

        if(parseInt(datum.nonce) === parseInt(microblock.nonce)) {
            console.log('active')
            e.className(['active', 'carousel-item']);
            await loadMicroBlock(datum.nonce);
            await detailsForCarousel(null, processedRecord.record, processedRecord.appDef.field)
        }

        function showDetails(request) {
            details(request, processedRecord.record, processedRecord.appDef.field);
        }

        carouselBody.append(
            e
        );
    }

    const modal = new bootstrap.Modal('#microblockModal');
    modal.show();

    let carouselEl = document.querySelector('#carouselMicrochain');
    try {
        carouselEl.dispose();
    }catch (e) {}


    new bootstrap.Carousel(carouselEl, {
        interval: false,
        keyboard: true
    });

    carouselEl.addEventListener('slide.bs.carousel', async function (evt) {
        await loadMicroBlock(carouselData[evt.to].nonce);
        await detailsForCarousel(null, processedRecord.record, processedRecord.appDef.field)

    });


    //dom.get('.carousel-control-prev').click(_ => carousel.prev());
    //dom.get('.carousel-control-next').click(_ => carousel.next());
}


// ============================================================================================================================ //
//  showAccount()                                                                                                               //
// ============================================================================================================================ //
async function showAccount(n) {
    let acct = getAccount(n),
        pubKey = await getAccountPublicKey(n);

    screenSet(
        accountList,
        title("Account #" + (n + 1)),

        section("Account name"),
        dom.create("p").className("_app_m12").text(acct.name),

        section("Public account key"),
        formatKey(pubKey),
        keyCopyLink(pubKey),

        dom.create("button").text("Modify the account name").click(_ => editAccountName(n, _ => showAccount(n))),
        dom.create("button").text("Your personal data").click(_ => userData(n)),
        dom.create("button").text("Show private keys").click(_ => showPrivateKeys(n)),
        dom.create("button").text("Close").click(accountList)
    );
}

// ============================================================================================================================ //
//  editAccountName()                                                                                                           //
// ============================================================================================================================ //
function editAccountName(n, backCallback) {
    let acct = getAccount(n);

    screenSet(
        backCallback,
        title("Account #" + (n + 1)),

        dom.create("p").className("_app_center").text("Enter a name to identify your account."),
        dom.create("input", "_app_name").className("_app_center").value(acct.name),
        dom.create("button").text("Confirm").click(submit)
    );

    async function submit() {
        acct.name = getField("name");
        await saveAccounts();
        (backCallback || home)();
    }
}

// ============================================================================================================================ //
//  userData()                                                                                                                  //
// ============================================================================================================================ //
function userData(n) {
    let acct = getAccount(n),
        verifyEmailButton = acct.userData.email && !acct.userData.emailProof;

    let fields = [
        [ "firstname", "Firstname" ],
        [ "lastname",  "Lastname"  ],
        [ "email",     "Email"     ]
    ];

    screenSet(
        _ => showAccount(n),
        title("Account #" + (n + 1))
    );

    fields.forEach(([ id, label ]) => {
        screenAppend(
            section(label),
            dom.create("p").className("_app_m12").text(acct.userData[id] || "(not specified)")
        );
    });

    if(acct.userData.emailProof) {
        let ts = new Date(acct.userData.emailProof.ts * 1000),
            date = ts.toLocaleDateString("en-US"),
            time = ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });

        screenAppend(
            dom.create("p").className("_app_m12 _app_success").style({ marginTop: "-10px" }).html(
                `<i class="bi bi-check-circle-fill"></i> <span style="font-weight:bold">verified</span> on ${date}, at ${time}`
            )
        );
    }

    if(verifyEmailButton) {
        screenAppend(
            dom.create("button").className("_app_mt16").text("Verify your email").click(_ => verifyEmail(n))
        );
    }

    screenAppend(
        dom.create("button").className(verifyEmailButton ? "" : "_app_mt16").text("Edit").click(_ => editUserData(n)),
        dom.create("button").text("Close").click(_ => showAccount(n))
    );
}

// ============================================================================================================================ //
//  verifyEmail()                                                                                                               //
// ============================================================================================================================ //
async function verifyEmail(n, refresh = true) {
    let acct = getAccount(n);

    if(refresh) {
        showSpinner();

        let pubKey = await getAccountPublicKey(n);

        let answer = await Carmentis.dataServerQuery(
            "email-validator/initialize",
            {
                email    : acct.userData.email,
                publicKey: toHexa(pubKey)
            }
        );

        application.otpToken = answer.data.token;

        await waitForSpinner();
    }

    screenSet(
        _ => userData(n),
        title("Email verification"),

        dom.create("p").text("A 6-digit verification code has been sent to your email address. Please enter this code below."),
        dom.create("input", "_app_otp").className("_app_otp").setAttribute("maxlength", 6),
        dom.create("button").className("_app_mt16").text("Confirm").click(submit)
    );

    async function submit() {
        let answer = await Carmentis.dataServerQuery(
            "email-validator/answer",
            {
                token: application.otpToken,
                value: getField("otp")
            }
        );

        if(answer.success) {
            acct.userData.emailProof = answer.data.proof;
            await saveAccounts();
            showSuccess(_ => userData(n));
        }
        else {
            showError(_ => verifyEmail(n, false));
        }
    }
}

// ============================================================================================================================ //
//  editUserData()                                                                                                              //
// ============================================================================================================================ //
function editUserData(n) {
    let acct = getAccount(n),
        previousEmail = acct.userData.email;

    screenSet(
        _ => userData(n),
        title("Account #" + (n + 1)),

        dom.create("label").text("Firstname"),
        dom.create("input", "_app_firstname").value(acct.userData.firstname),
        dom.create("label").text("Lastname"),
        dom.create("input", "_app_lastname").value(acct.userData.lastname),
        dom.create("label").text("Email"),
        dom.create("input", "_app_email").value(acct.userData.email),
        dom.create("br"),
        dom.create("button").className("_app_mt16").text("Confirm").click(submit)
    );

    async function submit() {
        acct.userData.firstname = getField("firstname");
        acct.userData.lastname = getField("lastname");
        acct.userData.email = getField("email");

        if(acct.userData.email != previousEmail) {
            delete acct.userData.emailProof;
        }

        await saveAccounts();
        userData(n);
    }
}

// ============================================================================================================================ //
//  showPrivateKeys()                                                                                                           //
// ============================================================================================================================ //
async function showPrivateKeys(n) {
    let acct = application.accounts[n];

    let pepper      = await Carmentis.derivePepperFromSeed(application.seed, n + 1),
        orgPrivKey  = await Carmentis.deriveOrganizationPrivateKey(pepper),
        nodePrivKey = await Carmentis.deriveNodePrivateKey(pepper);

    screenSet(
        _ => showAccount(n),
        title("Account #" + (n + 1)),

        section("Private organization key"),
        formatKey(orgPrivKey),
        keyCopyLink(orgPrivKey),

        section("Private node key"),
        formatKey(nodePrivKey),
        keyCopyLink(nodePrivKey),

        dom.create("button").text("Close").click(_ => showAccount(n))
    );
}

async function showOperatorKey(n) {
    let acct = application.accounts[n];

    let pepper      = await Carmentis.derivePepperFromSeed(application.seed, n + 1),
        orgPrivKey  = await Carmentis.deriveOrganizationPrivateKey(pepper),
        nodePrivKey = await Carmentis.deriveNodePrivateKey(pepper);

    screenSet(
        _ => showAccount(n),
        title("Account #" + (n + 1)),

        section("Private organization key"),
        formatKey(orgPrivKey),
        keyCopyLink(orgPrivKey),

        section("Private node key"),
        formatKey(nodePrivKey),
        keyCopyLink(nodePrivKey),

        dom.create("button").text("Close").click(_ => showAccount(n))
    );
}

// ============================================================================================================================ //
//  scan()                                                                                                                      //
// ============================================================================================================================ //
function scan() {
    screenSet(
        home,
        title("Scan the QR code"),

        dom.create("div").className("_app_scan").append(
            dom.create("div").className("_app_scan_top_left"),
            dom.create("div").className("_app_scan_top_right"),
            dom.create("div").className("_app_scan_bottom_left"),
            dom.create("div").className("_app_scan_bottom_right")
        ),

        dom.create("div").className("_app_qr")
    );

    setTimeout(
        _ => {
            let qrEl = dom.get("#qr"),
                imgEl = qrEl.find("img");

            dom.get("._app_qr").append(
                dom.create("img").setAttribute("src", imgEl.getAttribute("src"))
            );

            setTimeout(
                async _ => {
                    let qrData = qrEl.getAttribute("data-code");

                    await sound("success.ogg");
                    await processQRCode(qrData);
                },
                250
            );
        },
        500
    );
}

// ============================================================================================================================ //
//  processQRCode()                                                                                                             //
// ============================================================================================================================ //
export async function processQRCode(qrData) {
    console.log("processQRCode", qrData);

    await new Promise(function(resolve, reject) {
        (function waitForUnlock() {
            //console.log("waitForUnlock", application);
            if(application && application.seed) {
                console.log("wallet unlocked");
                resolve();
            }
            else {
                //console.log("wallet locked");
                setTimeout(waitForUnlock, 100);
            }
        })();
    });

    let request = await Carmentis.wallet.getRequestByQRCode(qrData);

    if(!request) {
        showError();
        return;
    }

    await confirmDevice(request);
}

// ============================================================================================================================ //
//  processClientRequest()                                                                                                      //
// ============================================================================================================================ //
export async function processClientRequest(request) {
    //console.log("processClientRequest", request);

    await new Promise(function(resolve, reject) {
        (function waitForUnlock() {
            if(application && application.seed) {
                console.log("wallet unlocked");
                resolve();
            }
            else {
                //console.log("wallet locked");
                setTimeout(waitForUnlock, 100);
            }
        })();
    });

    console.log("wallet unlocked");

    switch(request.type) {
        case "signIn": {
            requestSignIn(request);
            break;
        }
        case "authentication": {
            requestAuthentication(request);
            break;
        }
        case "eventApproval": {
            requestEventApproval(request);
            break;
        }
        default:
            console.error("Unknown request type: " + request.type);
            setTimeout(() => {
                window.close();
            }, 2000);
            break;
    }
}

// ============================================================================================================================ //
//  processServerRequest()                                                                                                      //
// ============================================================================================================================ //
async function processServerRequest(request) {
    switch(request.type) {
        case "blockData": {
            requestBlockData(request);
            break;
        }
        case "confirmRecord": {
            if(!db) {
                console.error("error: db null");
                return;
            }
            console.log(db)
            const objectStore = db.transaction(["microblocks"], "readwrite").objectStore("microblocks");

            if(request.data?.microBlockId){
                const r = await objectStore.get(request.data.microBlockId);

                r.onsuccess = function(event) {
                    const microblock = r.result;
                    if(microblock) {
                        console.log("Microblock already existing", microblock);
                    } else {
                        objectStore.add({
                            hash: request.data.microBlockId,
                            microchain: request.data.flowId,
                            nonce: request.data.nonce,
                            status: "Pending...",
                            ts: (new Date()).getTime()
                        });
                    }
                }
            } else {
                console.error("error: microBlockId null");
            }
        }
    }
}

// ============================================================================================================================ //
//  requestBlockData()                                                                                                          //
// ============================================================================================================================ //
async function requestBlockData(request) {
    flow = await Carmentis.prepareApproval(request.data.applicationId, request.data.flowId, new Uint8Array(request.data.blockData));

    approval(request);
}

// ============================================================================================================================ //
//  approval()                                                                                                                  //
// ============================================================================================================================ //
async function approval(request) {
    screenSet(
        null,
        title("Approval"),

        dom.create("div", "_app_event_status"),
        dom.create("hr"),
        dom.create("p", "_app_event_summary"),
        dom.create("button").className("_app_button").html(`<i class="bi bi-search"></i> See details`).click(showDetails),
        checkbox(
            "_app_agree",
            `I agree.`,
            checked => dom.get("#_app_confirm").disabled(!checked)
        ),
        dom.create("button", "_app_confirm").className("_app_button_small").text("Confirm").click(confirm).disabled(true),
        dom.create("button").className("_app_button_small").text("Cancel").click(cancel),
        dom.create("div").style({ position: "absolute", bottom: "10px" }).append(
            dom.create("hr"),
            dom.create("button").className("_app_button").html(`<i class="bi bi-clock-history"></i> See history`).click(_ => history(request))
        )
    );

    await loadMicroBlock(flow.flowObject.chain.microBlock.length);

    function showDetails() {
        details(request, processedRecord.record, processedRecord.appDef.field);
    }

    async function confirm() {
        showSpinner();

        let res = await request.answer({
            message : "confirmRecord",
            recordId: request.data.recordId
        });

        console.log('confirmRecord', res);

        await waitForSpinner();

        request.clientAnswer({
            success : true,
            recordId: request.data.recordId
        });

        //home();
        window.self.close();
    }

    function cancel() {
        request.clientAnswer({
            success: false
        });
        window.self.close();
        //home();
    }
}

// ============================================================================================================================ //
//  details()                                                                                                                   //
// ============================================================================================================================ //
async function details(request, node, fieldDef, path = [ "root" ], parents = []) {
    let arr = [];

    Object.keys(node).forEach(key => {
        let value = node[key],
            def = fieldDef.find(o => o.name == key);

        if(def.flag & CST.DATA.ARRAY) {
            arr.push({
                name : key,
                def  : def,
                value: value,
                bg   : "primary",
                label: "open",
                click: _ => _
            });
        }
        else if(def.flag & CST.DATA.STRUCT) {
            arr.push({
                name : key,
                def  : def,
                bg   : "primary",
                label: "open",
                click: _ => details(
                    request,
                    value,
                    processedRecord.appDef.structure[def.id].property,
                    [...path, key],
                    [...parents, { node: node, fieldDef: fieldDef }]
                )
            });
        }
        else {
            let bg, label;

            if(def.flag & CST.DATA.PUBLIC) {
                bg = "success";
                label = "public";
            }
            else {
                if(value === null) {
                    bg = "danger";
                    label = "encrypted";
                }
                else {
                    bg = "success";
                    label = "decrypted";
                }
            }
            arr.push({
                name : key,
                def  : def,
                value: value,
                bg   : bg,
                label: label,
                click: _ => _
            });
        }
    });

    screenSet(
        null,
        title("Event details"),

        dom.create("p").className("_app_center").text(path.join(".")),

        ...arr.map(obj =>
            dom.create("p").append(
                dom.create("b").text(obj.name),
                dom.create("span")
                    .style({ float: "right", width: "80px", height: "19px", marginTop: "2px" })
                    .className(`badge availability-badge rounded-pill bg-${obj.bg}`)
                    .text(obj.label)
                    .click(obj.click),
                dom.create("br"),
                ...getFieldValue(obj).map(str => dom.create("div").style({ fontFamily: "monospace" }).text(str))
            )
        ),

        ...parents.length ?
            [ dom.create("button").className("_app_button").text("Up").click(moveUp) ]
            :
            [],

        dom.create("button").className("_app_button").text("Back to event summary").click(_ => approval(request))
    );

    function moveUp() {
        let parent = parents.pop();

        details(
            request,
            parent.node,
            parent.fieldDef,
            path.slice(0, -1),
            parents
        );
    }
}

async function detailsForCarousel(request, node, fieldDef, path = [ "root" ], parents = []) {
    let arr = [];

    Object.keys(node).forEach(key => {
        let value = node[key],
            def = fieldDef.find(o => o.name == key);

        if(def.flag & CST.DATA.ARRAY) {
            arr.push({
                name : key,
                def  : def,
                value: value,
                bg   : "primary",
                label: "open",
                click: _ => _
            });
        }
        else if(def.flag & CST.DATA.STRUCT) {
            arr.push({
                name : key,
                def  : def,
                bg   : "primary",
                label: "open",
                click: _ => detailsForCarousel(
                    request,
                    value,
                    processedRecord.appDef.structure[def.id].property,
                    [...path, key],
                    [...parents, { node: node, fieldDef: fieldDef }]
                )
            });
        }
        else {
            let bg, label;

            if(def.flag & CST.DATA.PUBLIC) {
                bg = "success";
                label = "public";
            }
            else {
                if(value === null) {
                    bg = "danger";
                    label = "encrypted";
                }
                else {
                    bg = "success";
                    label = "decrypted";
                }
            }
            arr.push({
                name : key,
                def  : def,
                value: value,
                bg   : bg,
                label: label,
                click: _ => _
            });
        }
    });
    dom.get('#_app_event_details').clear();
    dom.get('#_app_event_details').append(
        dom.create("p").className("_app_center").text(path.join(".")),

        ...arr.map(obj =>
            dom.create("p").append(
                dom.create("b").text(obj.name),
                dom.create("span")
                    .style({ float: "right", width: "80px", height: "19px", marginTop: "2px" })
                    .className(`badge availability-badge rounded-pill bg-${obj.bg}`)
                    .text(obj.label)
                    .click(obj.click),
                dom.create("br"),
                ...getFieldValue(obj).map(str => dom.create("div").style({ fontFamily: "monospace" }).text(str))
            )
        ),

        ...parents.length ?
            [ dom.create("button").className("_app_button").text("Up").click(moveUp) ]
            :
            [],
    );

    dom.create("button").className("_app_button").text("Back to event summary").click(_ => approval(request))

    function moveUp() {
        let parent = parents.pop();

        detailsForCarousel(
            request,
            parent.node,
            parent.fieldDef,
            path.slice(0, -1),
            parents
        );
    }
}

// ============================================================================================================================ //
//  getFieldValue()                                                                                                             //
// ============================================================================================================================ //
function getFieldValue(obj) {
    if(obj.value === null) {
        return [ "undisclosed" ];
    }

    if(obj.def.flag & CST.DATA.ARRAY) {
        return [ `array of ${obj.value.length} entries` ];
    }

    if(obj.def.flag & CST.DATA.STRUCT) {
        return [ "structure" ];
    }

    switch(obj.def.id) {
        case CST.DATA.T_AMOUNT: {
            return [ obj.value.amount + " " + obj.value.currency ];
        }
        case CST.DATA.T_FILE: {
            return [
                '"' + obj.value.name + '"',
                "Size: " + helpers.formatNumber(obj.value.size, { sep: "," }) + " bytes",
                "CRCR32: " + obj.value.crc32,
                "SHA256: " + obj.value.sha256.slice(0, 16) + "\u22EF" + obj.value.sha256.slice(-4)
            ];
        }
        default: {
            return [ '"' + obj.value + '"' ];
        }
    }
}

// ============================================================================================================================ //
//  history()                                                                                                                   //
// ============================================================================================================================ //
async function history(request) {
    let count = flow.flowObject.chain.microBlock.length;

    screenSet(
        null,
        title("Flow history"),

        ...count > 1 ?
            [...Array(count - 1)].map((_, n) =>
                dom.create("button").className("_app_item_btn").text("Event " + (n + 1)).click(_ => show(n + 1))
            )
            :
            [ dom.create("p").text("This is the first event in this flow.") ],

        dom.create("button").className("_app_button").text("Back to approval").click(_ => approval(request))
    );

    async function show(n) {
        screenSet(
            null,
            title("Event " + n),

            dom.create("div", "_app_event_status"),
            dom.create("hr"),
            dom.create("p", "_app_event_summary"),
            dom.create("button").className("_app_button").html(`<i class="bi bi-search"></i> See details`).click(showDetails),
            dom.create("div").style({ position: "absolute", bottom: "10px" }).append(
                dom.create("hr"),
                dom.create("button").className("_app_button").html("Close").click(_ => history(request))
            )
        );

        await loadMicroBlock(n);
    }

    function showDetails() {
        details(request, processedRecord.record, processedRecord.appDef.field);
    }
}

// ============================================================================================================================ //
//  requestSignIn()                                                                                                             //
// ============================================================================================================================ //
async function requestSignIn(request) {
  let pubKey = await getAccountPublicKey(application.currentAccount),
      privKey = await getAccountPrivateKey(application.currentAccount);

  let signature = await Carmentis.sign(privKey, fromHexa(request.data.sessionPublicKey));

  console.log("signature", signature);

  screenSet(
    null,
    title("Sign In Request"),

    dom.create("p").text(
      "Would you like to sign in to the Carmentis workspace?"
    ),

    dom.create("button").text("Confirm").click(confirm),
    dom.create("button").text("Cancel").click(cancel)
  );

  function confirm() {
    request.answer({
      success: true,
      data: {
        pubKey: toHexa(pubKey),
        sessionPubKeySignature: toHexa(signature)
      }
    });
    window.close();
  }

  function cancel() {
    request.answer({
      success: false
    });
    window.close();
  }
}

// ============================================================================================================================ //
//  requestAuthentication()                                                                                                     //
// ============================================================================================================================ //
async function requestAuthentication(request) {
    let proof = application.accounts[application.currentAccount].userData.emailProof;

    if(proof === undefined) {
        userData(application.currentAccount);
        return;
    }

    screenSet(
        null,
        title("Authentication Request"),

        dom.create("p").html(
            `Do you confirm your authentication as <b>${proof.email}</b>?`
        ),

        dom.create("button").text("Confirm").click(confirm),
        dom.create("button").text("Cancel").click(cancel)
    );

    function confirm() {
        request.answer({
            success: true,
            proof  : proof
        });
        //window.close();
        //home();
    }

    function cancel() {
        request.answer({
            success: false
        });
        //window.close();
        //home();
    }
}

// ============================================================================================================================ //
//  requestEventApproval()                                                                                                      //
// ============================================================================================================================ //
async function requestEventApproval(request) {
    let [ applicationId, recordId ] = request.data.id.split("-");

    let pepper  = await Carmentis.derivePepperFromSeed(application.seed, application.currentAccount + 1),
        privKey = await Carmentis.deriveUserPrivateKey(pepper, fromHexa(applicationId)),
        pubKey  = await Carmentis.getPublicKey(privKey);

    await request.answer({
        message  : "walletHandshake",
        recordId : recordId,
        publicKey: toHexa(pubKey)
    });
    //window.close();

//confirmNewApplication(request);
}

// ============================================================================================================================ //
//  confirmDevice()                                                                                                             //
// ============================================================================================================================ //
async function confirmDevice(request) {
    console.log("confirmDevice", request);

    let answer = await Carmentis.dataServerQuery(
        "geolocation/query",
        {
            ip: request.ip
        }
    );

    if(!answer.success) {
        showError();
        return false;
    }

    let geo = answer.data.geo;

    let connectionInfo = [
        [ "Country",    CST.COUNTRY.country[geo.countryCode] ],
        [ "City",       geo.city ],
        [ "ASN",        geo.org.match(/^\S+ (.*)/)[1] ],
        [ "IP address", request.ip ]
    ];

    let expectedDomain = "example.carmentis.local";

    screenSet(
        home,
        title("Warning"),

        dom.create("p").text(
            "The website and/or device showing this QR code is currently not linked to your wallet."
        ),

        dom.create("p").className("_app_mt16").text("1. Make sure that the page displaying this QR code is "),
        dom.create("p").className("_app_info").text(expectedDomain),
        dom.create("p").text("2. Review the connection information below:"),

        infoTable(connectionInfo),

        checkbox(
            "agree",
            "Everything looks OK.",
            checked => dom.get("#_app_ok").disabled(!checked)
        ),

        dom.create("button", "_app_ok").text("Confirm").click(confirm).disabled(true),
        dom.create("button").text("Cancel").click(cancel)
    );

    async function confirm() {
        await request.accept();
    }

    async function cancel() {
        await request.reject();
        window.self.close();
        //home();
    }
}

// ============================================================================================================================ //
//  confirmNewApplication()                                                                                                     //
// ============================================================================================================================ //
async function confirmNewApplication(request) {
    let applicationName = "FileSign",
        organizationName = "ACME Corp.";

    let appInfo = [
        [ "Name",     applicationName ],
        [ "Operator", organizationName ]
    ];

    let permissions = [
        "your verified email address"
    ];

    screenSet(
        home,
        title("New Application"),

        dom.create("p").text(
            "Would you like to connect your wallet to this application?"
        ),

        infoTable(appInfo),

        dom.create("p").text(`Data access permissions:`),
        dom.create("ul").append(
            ...permissions.map(str => dom.create("li").text(str))
        ),

        dom.create("button", "_app_ok").text("Confirm").click(confirm),
        dom.create("button").text("Cancel").click(cancel)
    );

    async function confirm() {
        window.self.close();
        //home();
    }

    async function cancel() {
        window.self.close();
        //home();
    }
}

// ============================================================================================================================ //
//  accountList()                                                                                                               //
// ============================================================================================================================ //
function accountList() {
    screenSet(
        home,
        title("Your accounts"),

        ...application.accounts.map((acct, n) =>
            dom.create("div").append(
                dom.create("button").className("_app_item_btn").append(
                    ...n == application.currentAccount ?
                        [ dom.create("span").className("_app_btn_check").append(icon("check-circle-fill")) ]
                        :
                        [],
                    dom.create("span").text(`#${n + 1} - ${acct.name}`)
                )
                    .click(_ => showAccount(n))
            )
        ),

        dom.create("hr"),
        dom.create("button").html(`<i class="bi bi-check2-circle"></i> Change active account`).click(activeAccount),
        dom.create("button").html(`<i class="bi bi-plus-circle"></i> Create a new account`).click(_ => editAccountName(application.accounts.length, accountList)),
        dom.create("button").text("Close").click(home)
    );
}

// ============================================================================================================================ //
//  activeAccount()                                                                                                             //
// ============================================================================================================================ //
function activeAccount() {
    let sel = application.currentAccount;

    screenSet(
        accountList,
        title("Select active account"),

        ...application.accounts.map((acct, n) =>
            dom.create("div").append(
                dom.create("input", "_app_acct" + n).setAttribute("type", "radio").setAttribute("name", "accounts").checked(n == sel).click(_ => sel = n),
                dom.create("label").setAttribute("for", "_app_acct" + n).text(`#${n + 1} - ${acct.name}`)
            )
        ),

        dom.create("button").className("_app_mt16").text("Confirm").click(submit)
    );

    function submit() {
        application.currentAccount = sel;
        accountList();
    }
}

// ============================================================================================================================ //
//  parameters()                                                                                                                //
// ============================================================================================================================ //
function parameters() {
    screenSet(
        home,
        title("Parameters"),

        dom.create("button").text("Show the passphrase").click(passphrase),
        dom.create("button").text("Set endpoints").click(setEndpoints),
        dom.create("button").className("_app_bg_red").text("Reset your wallet").click(reset)
    );

    async function passphrase() {
        application.wordList = Carmentis.getWordListFromSeed(application.seed);
        showPassphrase(parameters, true, false);
    }

    async function reset() {
        await storage.del("config");
        await storage.del("accounts");
        await storage.del("seed");
        start();
    }
}

// ============================================================================================================================ //
//  setEndpoints()                                                                                                              //
// ============================================================================================================================ //
function setEndpoints() {
    screenSet(
        parameters,
        title("Endpoints"),

        dom.create("label").text("Node endpoint"),
        dom.create("input", "_app_node_endpoint").value(application.config.nodeEndpoint),
        dom.create("label").text("Data endpoint"),
        dom.create("input", "_app_data_endpoint").value(application.config.dataEndpoint),
        dom.create("button").className("_app_mt16").text("Confirm").click(submit)
    );

    async function submit() {
        application.config.nodeEndpoint = getField("node_endpoint");
        application.config.dataEndpoint = getField("data_endpoint");

        await saveConfig();
        applyConfig();
        parameters();
    }
}

// ============================================================================================================================ //
//  checkbox()                                                                                                                  //
// ============================================================================================================================ //
function checkbox(id, label, callback, checked) {
    let el = dom.create("div").className("_app_checkbox").append(
        dom.create("label").append(
            dom.create("input", id).setAttribute("type", "checkbox").checked(checked),
            dom.create("span").html(label)
        )
    );

    if(callback) {
        el.event("change", e => callback(e.target.checked));
    }

    return el;
}

// ============================================================================================================================ //
//  screenSet()                                                                                                                 //
// ============================================================================================================================ //
function screenSet(back, ...content) {
    application.backCallback = back;

    if(back) {
        content.push(
            dom.create("div").className("_app_back").append(
                icon("arrow-left-short").click(back)
            )
        );
    }

    dom.get("#_app_content").setContent(...content);
}

// ============================================================================================================================ //
//  screenAppend()                                                                                                              //
// ============================================================================================================================ //
function screenAppend(...content) {
    dom.get("#_app_content").append(...content);
}

// ============================================================================================================================ //
//  aboutSecurity()                                                                                                             //
// ============================================================================================================================ //
function aboutSecurity(e) {
    e.preventDefault();
    e.stopPropagation();

    dom.get("#_app_over").setContent(
        title("Security"),

        section("Your data"),
        dom.create("p").text("With Carmentis, and unlike what happens in a classic centralized system, your data is stored in an encrypted blockchain. You, and only you, have the ability to access your data using your private key."),

        section("Your passphrase"),
        dom.create("p").text("Your private key is derived from a passphrase. At no time does Carmentis have access to your passphrase. It is your responsibility to store it securely."),

        section("Your password"),
        dom.create("p").text("On a given device, your key is itself encrypted using a password for easier and faster access. At no time does Carmentis have access to your password. To renew it, you must provide either the previous password (on a specific device) or the original passphrase (on any device)."),

        dom.create("button").text("OK").click(_ => dom.get("#_app_over").hide())
    )
        .show();
}

// ============================================================================================================================ //
//  getField()                                                                                                                  //
// ============================================================================================================================ //
function getField(id) {
    return dom.get("#_app_" + id).el.value.trim();
}

// ============================================================================================================================ //
//  getAccount()                                                                                                                //
// ============================================================================================================================ //
export function getAccount(n) {
    let acct = application.accounts[n] = application.accounts[n] || { name: "" };

    acct.userData = acct.userData || {};
    acct.userData.firstname = acct.userData.firstname || "";
    acct.userData.lastname = acct.userData.lastname || "";
    acct.userData.email = acct.userData.email || "";

    return application.accounts[n];
}

// ============================================================================================================================ //
//  loadAccounts()                                                                                                              //
// ============================================================================================================================ //
async function loadAccounts() {
    application.accounts = await storage.readJson("accounts");
}

// ============================================================================================================================ //
//  saveAccounts()                                                                                                              //
// ============================================================================================================================ //
async function saveAccounts() {
    await storage.writeJson("accounts", application.accounts);
}

// ============================================================================================================================ //
//  title()                                                                                                                     //
// ============================================================================================================================ //
function title(str) {
    return dom.create("div").className("_app_title").text(str);
}

// ============================================================================================================================ //
//  section()                                                                                                                   //
// ============================================================================================================================ //
function section(str) {
    return dom.create("div").className("_app_section").html(str);
}

// ============================================================================================================================ //
//  icon()                                                                                                                      //
// ============================================================================================================================ //
function icon(name) {
    return dom.create("i").className("bi bi-" + name);
}

// ============================================================================================================================ //
//  infoTable()                                                                                                                 //
// ============================================================================================================================ //
function infoTable(info) {
    return (
        dom.create("table").className("_app_info_table").append(
            ...info.map(([ key, value ]) =>
                dom.create("tr").append(
                    dom.create("td").text(key),
                    dom.create("th").text(value)
                )
            )
        )
    );
}

// ============================================================================================================================ //
//  getAccountPrivateKey()                                                                                                      //
// ============================================================================================================================ //
async function getAccountPrivateKey(n) {
  let pepper  = await Carmentis.derivePepperFromSeed(application.seed, n + 1),
      privKey = await Carmentis.deriveAuthenticationPrivateKey(pepper);

  return privKey;
}

// ============================================================================================================================ //
//  getAccountPublicKey()                                                                                                       //
// ============================================================================================================================ //
async function getAccountPublicKey(n) {
  let privKey = await getAccountPrivateKey(n),
      pubKey  = await Carmentis.getPublicKey(privKey);

  return pubKey;
}

// ============================================================================================================================ //
//  formatKey()                                                                                                                 //
// ============================================================================================================================ //
function formatKey(key) {
    let hex = toHexa(key);

    return dom.create("p").className("_app_key").html(hex.slice(0, hex.length / 2) + "<br>" + hex.slice(hex.length / 2));
}

// ============================================================================================================================ //
//  keyCopyLink()                                                                                                               //
// ============================================================================================================================ //
function keyCopyLink(key) {
    return dom.create("p").className("_app_center _app_mt16").append(
        dom.create("a").setAttribute("href", "#").html(`<i class="bi bi-copy"></i> Copy this key`)
            .click(e => {
                e.preventDefault();
                navigator.clipboard.writeText(toHexa(key));
            })
    );
}

// ============================================================================================================================ //
//  toHexa()                                                                                                                    //
// ============================================================================================================================ //
function toHexa(arr) {
    return [...arr].map(v => v.toString(16).toUpperCase().padStart(2, "0")).join("");
}

// ============================================================================================================================ //
//  fromHexa()                                                                                                                  //
// ============================================================================================================================ //
function fromHexa(str) {
    return new Uint8Array(typeof str == "string" && str.match(/^([\da-f]{2})*$/gi) ? str.match(/../g).map(s => parseInt(s, 16)) : []);
}

// ============================================================================================================================ //
//  showSuccess()                                                                                                               //
// ============================================================================================================================ //
function showSuccess(callback = home) {
    screenSet(
        null,
        dom.create("div").className("_app_notif_icon _app_success_bg").append(icon("check-lg"))
    );

    setTimeout(callback, 1000);
}

// ============================================================================================================================ //
//  showError()                                                                                                                 //
// ============================================================================================================================ //
function showError(callback = home) {
    screenSet(
        null,
        dom.create("div").className("_app_notif_icon _app_error_bg").append(icon("x"))
    );

    setTimeout(callback, 1000);
}

// ============================================================================================================================ //
//  showSpinner()                                                                                                               //
// ============================================================================================================================ //
function showSpinner() {
    application.spinnerTs = +new Date;

    screenSet(
        null,
        dom.create("div").className("spinner-border text-primary _app_spinner")
    );
}

// ============================================================================================================================ //
//  waitForSpinner()                                                                                                            //
// ============================================================================================================================ //
async function waitForSpinner() {
    let delay = Math.max(0, application.spinnerTs + 500 - new Date);

    return await new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}

// ============================================================================================================================ //
//  sound()                                                                                                                     //
// ============================================================================================================================ //
async function sound(file) {
    return new Promise(function(resolve, reject) {
        let audio = new Audio("assets/debug-app/audio/" + file);

        audio.addEventListener(
            "ended",
            _ => {
                resolve();
            }
        );

        audio.play();
    });
}

// ============================================================================================================================ //
//  loadMicroBlock()                                                                                                            //
// ============================================================================================================================ //
async function loadMicroBlock(nonce) {
    let msgParts = [];

    processedRecord = await Carmentis.processRecord(flow, nonce, textRendering, fieldRendering);

    console.log("processedRecord", processedRecord);

    function textRendering(str) {
        msgParts.push(
            dom.textNode(str)
        );
    }

    function fieldRendering(field, def, value) {
        msgParts.push(
            dom.create("span")
                .className("_app_msg_field" + (value === null ? " undisclosed" : ""))
                .setAttribute("data-bs-toggle", "tooltip")
                .setAttribute("title", field)
                .text(formattedFieldValue(def, value))
        );
    }

    setStatus(processedRecord.data);

    dom.get("#_app_event_summary").setContent(...msgParts);
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    // -------------------------------------------------------------------------------------------------------------------------- //
    //  final output                                                                                                              //
    // -------------------------------------------------------------------------------------------------------------------------- //
//if(!res.valid) {
//  showAlert("This proof is inconsistent. The data fields listed on this page should NOT be trusted.");
//}

//dom.get("#spinner").clear();
//showData("#fieldList", res.appDef, res.appDef.field, res.record);

//setPagination(flow.flowObject.chain.microBlock.length, nonce);
}

// ============================================================================================================================ //
//  formattedFieldValue()                                                                                                       //
// ============================================================================================================================ //
function formattedFieldValue(def, value) {
    if(value === null) {
        return `undisclosed`;
    }

    if(def.flag & CST.DATA.ARRAY) {
        return `array of ${value.length} entries`;
    }

    if(def.flag & CST.DATA.STRUCT) {
        return `structure`;
    }

    switch(def.id) {
        case CST.DATA.T_AMOUNT: {
            return value.amount + " " + value.currency;
        }
        case CST.DATA.T_FILE: {
            return value.name;
        }
        default: {
            return value;
        }
    }
}

// ============================================================================================================================ //
//  setStatus()                                                                                                                 //
// ============================================================================================================================ //
function setStatus(data) {
    let microChain = flow.flowObject.chain,
        microBlock = data.microBlock,
        ts = new Date(microBlock.ts * 1000),
        day = ts.getUTCDate();

    let dateString =
        ts.toLocaleString("en-US", { month: "long", timeZone: "UTC" }) + " " +
        day + ([ "", "st", "nd", "rd" ][day % 10] || "th") + ", " +
        ts.getUTCFullYear();

    let timeString =
        ts.getUTCHours().toString().padStart(2, "0") + ":" +
        ts.getUTCMinutes().toString().padStart(2, "0") + ":" +
        ts.getUTCSeconds().toString().padStart(2, "0") + " (UTC)";

    let eventInfo = [
        [ "Application",  flow.appDescription.name + " | version " + flow.flowObject.appVersion(microBlock.nonce) ],
        [ "Date",         dateString ],
        [ "Time",         timeString ],
        [ "Status",       microBlock.pending ? "Awaiting user approval" : "Anchored" ]
    ];

    dom.get("#_app_event_status").setContent(infoTable(eventInfo));

    /*
      dom.get("#storage").setContent(
        ...microBlock.pending ?
          [
            dom.create("div").className("row").append(
              dom.create("div").className("col-lg-12 col-md-8").text("This record has not yet been committed to the Carmentis blockchain.")
            )
          ]
        :
          [[ microBlock, "microblock", "Micro Block" ], [ microChain, "microchain", "Micro Chain" ]].map(([ obj, path, name ]) =>
            dom.create("div").className("row").append(
              dom.create("div").className("col-lg-3 col-md-4 label").text(name),
              dom.create("div").className("col-lg-9 col-md-8").append(
                dom.create("span").className("mono").text(formatHash(obj.hash) + " "),
                dom.create("button").className("btn btn-primary btn-sm rounded-pill").html(
                  `<i class="bi bi-box-arrow-up-left"></i> Explore</button>`
                )
                .click(_ => window.open(config.DATA_URL + `/explorer/${path}/0x` + uint8.toHexa(obj.hash)))
              )
            )
          )
      );
    */
}
