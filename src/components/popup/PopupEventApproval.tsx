import {RecoilLoadable, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    ApplicationLedgerVb,
    EncoderFactory,
    Hash,
    Microblock,
    MicroblockConsistencyChecker,
    ProviderFactory,
    SignatureSchemeId,
    VirtualBlockchainLabel,
    WalletCrypto,
    WalletRequestType,
    WalletResponse,
    wiExtensionWallet
} from "@cmts-dev/carmentis-sdk/client";
import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Box, Button, Typography} from "@mui/material";
import {Code, KeyboardBackspace} from "@mui/icons-material";
import {dataViewEnabledState, errorState} from "@/components/popup/states.ts";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest} from "@/entrypoints/background.ts";
import {Splashscreen} from "@/components/shared/Splashscreen.tsx";
import {
    AcceptDeclineButtonsFooter,
    OriginAndDateOfCurrentRequest,
    PopupNotificationLayout,
    useAccept,
    useActiveAccount,
    useClearClientRequest,
    useClientRequest
} from "@/components/popup/PopupDashboard.tsx";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {useWallet} from "@/hooks/useWallet.tsx";
import {ApprovalMessageViewer} from "@/components/popup/ApprovalMessageViewer.tsx";
import {RecordDataViewer} from "@/components/popup/RecordDataViewer.tsx";
import {useAsync} from "react-use";
import loading = RecoilLoadable.loading;
import {activeAccountCryptoState} from "@/states/globals.tsx";


function PopupLoading(input:{label: string}) {
    const clearRequest = useClearClientRequest();
    return <>
        <Splashscreen label={"Microblock approval loading..."}/>
        <button onClick={clearRequest}>Stop</button>
    </>
}

/**
 * PopupEventApproval is a React functional component that handles the process of approving or declining
 * an event request from a client application. It integrates with blockchain interaction libraries
 * to fetch approval data and allows the user to browse and view detailed information about the request.
 * The user can approve or decline the request, triggering appropriate actions and responses.
 *
 * @return {JSX.Element} A rendered component displaying the approval request details, browsing options,
 *                       and actionable buttons for the user to accept or decline the request.
 */
export default function PopupEventApproval() {
    // we use these functions to manage the state of the request
    const clearRequest = useClearClientRequest();
    const maskAsAccepted = useAccept();
    const setError = useSetRecoilState(errorState);

    //
    const [dataViewEnabled, setDataViewEnabled] = useRecoilState(dataViewEnabledState);


    // obtain the received request
    const {walletRequest, clientRequest} = useClientRequest();


    // instantiate the cryptography keys for the active account
    const wallet = useWallet();
    const encoder = EncoderFactory.defaultBytesToStringEncoder();
    const activeAccount = useActiveAccount();
    const accountCrypto = useRecoilValue(activeAccountCryptoState)

    // create a reference to the virtual blockchain containing the microblock block to approve (initially undefined)
    const virtualBlockchainRef = useRef<ApplicationLedgerVb|null>(null);
    const microblockRef = useRef<Microblock|null>(null);


    const wiWallet = new wiExtensionWallet();
    const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint);

    // use an async method for preparation
    const {value, loading: isPreparing, error: preparationFailure} = useAsync(async () => {
        if (clientRequest === undefined) throw new Error("Client request is undefined");
        if (walletRequest === undefined) throw new Error("Wallet request is undefined");
        if (walletRequest.type !== WalletRequestType.DATA_APPROVAL) throw new Error("Invalid wallet request type");

        const serverUrl = walletRequest.serverUrl;
        const anchorRequestId = walletRequest.anchorRequestId
        console.log(`Fetching approval data at ${serverUrl} for anchor request id:`, anchorRequestId);
        const approvalData = await wiWallet.getApprovalData(
            accountCrypto,
            {serverUrl, anchorRequestId}
        );

        // parse the  received microblock
        console.log("Parsing received microblock")
        const b64 = EncoderFactory.bytesToBase64Encoder();
        const mb = Microblock.loadFromSerializedMicroblock(
            b64.decode(approvalData.b64SerializedMicroblock)
        );
        console.log(mb.toString())
        console.log(EncoderFactory.bytesToBase64Encoder().encode(mb.getPreviousHash().toBytes()))

        // check that the microblock is valid
        let applicationLedger = mb.getHeight() === 1 ?
            ApplicationLedgerVb.createApplicationLedgerVirtualBlockchain(provider) :
            await provider.loadApplicationLedgerVirtualBlockchain(
                await provider.getVirtualBlockchainIdContainingMicroblock(
                    // we are looking for the previous microblock hash, the received one is not anchored yet
                    mb.getPreviousHash()
                )
            );
        applicationLedger.enableDraftMode();
        await applicationLedger.appendMicroBlock(mb);

        // store the application ledger and microblock
        virtualBlockchainRef.current = applicationLedger;
        microblockRef.current = mb;


        console.log("chain id:", encoder.encode(applicationLedger.getId()))
    }, []);

    useEffect(() => {
        if (preparationFailure) {
            setError(preparationFailure.message)
        }
    }, [preparationFailure])

    /*
    useEffect(() => {
        if (preparationFailure) {
            clearRequest()
            console.error(preparationFailure);
            setError(preparationFailure.message);
        }
    }, [isPreparing, preparationFailure]);


     */

    async function accept() {
        if (walletRequest === undefined) throw new Error("Wallet request is undefined");
        if (walletRequest.type !== WalletRequestType.DATA_APPROVAL) throw new Error("Invalid wallet request type");

        // derive the actor key from the private key and the genesis seed
        const genesisSeed = await virtualBlockchainRef.current!.getGenesisSeed();
        console.log(`Obtained genesis seed when accepting: ${EncoderFactory.bytesToBase64Encoder().encode(genesisSeed.toBytes())}`)
        /*
        const {loading, error, value: record} = useAsync(async () => {
            const genesisSeed = await applicationLedger.getGenesisSeed();
            const actorCrypto = accountCrypto?.deriveActorFromVbSeed(genesisSeed.toBytes());
            console.log(actorCrypto);
            const pk = await actorCrypto?.getPublicSignatureKey(SignatureSchemeId.SECP256K1);
            console.log(applicationLedger)
            console.log(await applicationLedger.getActorIdByPublicSignatureKey(pk))
            return await applicationLedger.getRecord(h, actorCrypto);
        }, [h])

         */
        const actorCrypto = accountCrypto.deriveActorFromVbSeed(genesisSeed.toBytes());
        const actorPrivateSignatureKey = await actorCrypto.getPrivateSignatureKey(SignatureSchemeId.SECP256K1);


        // TODO: check that we are currently the endorser
        const mb = microblockRef.current;
        if (mb === null) throw new Error("Microblock is undefined");
        const signature = await mb.sign(
            actorPrivateSignatureKey,
            false
        );

        const serverUrl = walletRequest.serverUrl;
        const anchorRequestId = walletRequest.anchorRequestId
        try {
            const answer = await wiWallet.sendApprovalSignature(
                serverUrl,
                anchorRequestId,
                signature
            );


            // store the virtual blockchain id in which the user is involved
            const b64 = EncoderFactory.bytesToBase64Encoder();
            const hex = EncoderFactory.bytesToHexEncoder();
            const vbHash = b64.decode(answer.b64VbHash);
            console.log(`Received virtual blockchain id: ${hex.encode(vbHash)}`)
            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            await db.storeApplicationVirtualBlockchainId(hex.encode(vbHash))

            // clear the current request
            const response: BackgroundRequest<WalletResponse> = {
                backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
                payload: answer
            }

            console.log("[popup dashboard] Response:", response)
            browser.runtime.sendMessage(response);
            maskAsAccepted()
        } catch (e) {
            console.error(e);
            setError(e)
        }

    }

    console.log(value, preparationFailure)
    if (isPreparing) return <PopupLoading label={"Microblock approval loading..."}/>
    if (preparationFailure) return <>An error occured: {preparationFailure.message}</>

    const applicationLedger = virtualBlockchainRef.current!;

    let header = <></>;
    let body = <></>;
    const footer = (
        <Box className="flex flex-col w-full space-y-2">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    fullWidth={true}
                    size="small"
                    className={`py-1.5 text-sm transition-all duration-200 rounded-md ${
                        dataViewEnabled 
                            ? "border-indigo-200 text-indigo-600 hover:bg-indigo-50" 
                            : "border-amber-200 text-amber-600 hover:bg-amber-50"
                    }`}
                    variant="outlined"
                    startIcon={
                        dataViewEnabled 
                            ? <KeyboardBackspace className="h-3.5 w-3.5" /> 
                            : <Code className="h-3.5 w-3.5" />
                    }
                    onClick={() => setDataViewEnabled(!dataViewEnabled)}
                >
                    {dataViewEnabled ? "Back to Request" : "View Event Data"}
                </Button>
            </motion.div>
            <AcceptDeclineButtonsFooter accept={accept}/>
        </Box>
    )
    if (dataViewEnabled) {
        header = (
            <Box className="flex items-center">
                <Box className="bg-indigo-50 p-1.5 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </Box>
                <Typography variant="subtitle1" className="font-medium text-gray-800">
                    Event Data Explorer
                </Typography>
            </Box>
        );

        body = (
            <Box className="grow h-full">
                <RecordDataViewer applicationLedger={applicationLedger}/>
            </Box>
        )
    } else {
        header = (
            <Box className="flex items-center">
                <Box className="bg-amber-50 p-1.5 rounded-full mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </Box>
                <Typography variant="subtitle1" className="font-medium text-gray-800">
                    Event Approval Request
                </Typography>
            </Box>
        );

        body = (
            <Box className="space-y-3">
                <Box className="bg-amber-50 border-l-2 border-amber-400 p-2 rounded-r-md text-xs text-amber-700">
                    An application is requesting your approval for an event. Please review the details below.
                </Box>
                <OriginAndDateOfCurrentRequest/>
                <Box className="grow">
                    <ApprovalMessageViewer applicationLedger={applicationLedger}/>
                </Box>
            </Box>
        )
    }
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}



