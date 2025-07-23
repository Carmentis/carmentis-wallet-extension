import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    ApplicationLedger,
    Blockchain,
    EncoderFactory,
    Hash,
    ProviderFactory,
    wiExtensionWallet
} from "@cmts-dev/carmentis-sdk/client";
import React, {useEffect, useRef, useState} from "react";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {motion} from "framer-motion";
import {Box, Button, Typography} from "@mui/material";
import {Code, KeyboardBackspace} from "@mui/icons-material";
import {dataViewEnabledState, errorState} from "@/components/popup/states.ts";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse} from "@/entrypoints/background.ts";
import {Splashscreen} from "@/components/shared/Splashscreen.tsx";
import {
    AcceptDeclineButtonsFooter,
    OriginAndDateOfCurrentRequest,
    PopupNotificationLayout,
    useAccept,
    useActiveAccount,
    useClearClientRequest,
    useUserKeyPair
} from "@/components/popup/PopupDashboard.tsx";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {useWallet} from "@/hooks/useWallet.tsx";
import {ApprovalMessageViewer} from "@/components/popup/ApprovalMessageViewer.tsx";
import {RecordDataViewer} from "@/components/popup/RecordDataViewer.tsx";
import {clientRequestSessionState} from "@/states/globals.tsx";

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
    const clearRequest = useClearClientRequest();
    const maskAsAccepted = useAccept();
    const genKeyPair = useUserKeyPair();
    const wallet = useWallet();
    const activeAccount = useActiveAccount();
    const [ready, setReady] = useState(false);
    const virtualBlockchainRef = useRef<ApplicationLedger|null>(null);
    const [dataViewEnabled, setDataViewEnabled] = useRecoilState(dataViewEnabledState);
    const setError = useSetRecoilState(errorState);
    const wiWallet = new wiExtensionWallet();
    const clientRequest = useRecoilValue(clientRequestSessionState);
    const req = wiWallet.getRequestFromMessage(clientRequest.data);
    const blockchain = Blockchain.createFromProvider(
        ProviderFactory.createInMemoryProviderWithExternalProvider(wallet.nodeEndpoint)
    );

    useEffect(() => {
        setDataViewEnabled(true);
        const loadRequest = async () => {
            const keyPair = await genKeyPair();
            const encoder = EncoderFactory.defaultBytesToStringEncoder();
            const walletSeed = encoder.decode(wallet.seed);

            wiWallet.getApprovalData(keyPair.privateKey, walletSeed, req.object)
                .then(async (microblockData) => {

                    // check the received microblock
                    const importer = blockchain.getMicroblockImporter(microblockData);
                    const isValidMicroBlock = await importer.isValidMicroBlock();
                    if (!isValidMicroBlock) throw new Error("Invalid microblock received");

                    // load the microblock
                    const applicationLedger = importer.getVirtualBlockchainObject<ApplicationLedger>();
                    const virtualBlockchain = applicationLedger.getVirtualBlockchain();
                    virtualBlockchainRef.current = applicationLedger;
                    console.log("chain id:", encoder.encode(virtualBlockchain.getId()))
                    setReady(true)
                }).catch(e => {
                    clearRequest()
                    console.error(e);
                    setError(e.message);
                });
        };

        loadRequest();


        return () => {
            clearRequest()
        }
    }, []);


    async function accept() {
        // derive the actor key from the private key and the genesis seed
        const keyPair = await getUserKeyPair(wallet!, activeAccount!);
        const vb = applicationLedger.getVirtualBlockchain();
        const signature = await vb.signAsEndorser(keyPair.privateKey); // TODO: derive key pair

        try {
            const answer = await wiWallet.sendApprovalSignature(keyPair.privateKey, req.object, signature);
            const vbHash = answer.walletObject.vbHash;

            // store the virtual blockchain id in which the user is involved
            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            await db.storeApplicationVirtualBlockchainId(Hash.from(vbHash).encode())

            // clear the current request
            const response: BackgroundRequest<ClientResponse> = {
                backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
                payload: answer.clientAnswer
            }

            console.log("[popup dashboard] Response:", response)
            browser.runtime.sendMessage(response);
            maskAsAccepted()
        } catch (e) {
            console.error(e);
            setError(e)
        }

    }

    if (!ready) return <Splashscreen label={"Request loading..."}/>
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
            <Box className="flex-grow h-full">
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
                <Box className="flex-grow">
                    <ApprovalMessageViewer applicationLedger={applicationLedger}/>
                </Box>
            </Box>
        )
    }
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}



