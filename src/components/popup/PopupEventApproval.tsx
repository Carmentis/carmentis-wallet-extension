import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";
import {
    ApplicationLedger,
    ApplicationLedgerVb,
    Blockchain,
    EncoderFactory, Hash,
    Microblock,
    ProviderFactory,
    wiExtensionWallet
} from "@cmts-dev/carmentis-sdk/client";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import { motion } from "framer-motion";
import { PopupJsonViewer } from "@/components/popup/PopupJsonViewer.tsx";
import {
    Box,
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    ChevronRight,
    KeyboardArrowDown,
    KeyboardArrowUp,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
    KeyboardBackspace,
    CalendarToday,
    TextFields,
    Numbers,
    List,
    Code,
    MoreHoriz,
    Error as ErrorIcon
} from "@mui/icons-material";
import Skeleton from "react-loading-skeleton";
import {
    dataViewEnabledState, errorState,
    heightState,
    pathState
} from "@/components/popup/popup-even-approval.state.ts";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse} from "@/entrypoints/background.ts";
import {Splashscreen} from "@/components/Splashscreen.tsx";
import {
    AcceptDeclineButtonsFooter,
    OriginAndDateOfCurrentRequest,
    PopupNotificationLayout, useAccept, useActiveAccount, useClearClientRequest, useUserKeyPair
} from "@/components/popup/PopupDashboard.tsx";
import {useAsync} from "react-use";
import {AccountDataStorage} from "@/utils/db/AccountDataStorage.ts";
import {activeAccountState, walletState} from "@/states/states.tsx";
import {useWallet} from "@/hooks/useWallet.tsx";

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


type AppLedgerVBProps = { applicationLedger: ApplicationLedger }

/**
 * Represents a token type specifically tied to a field within a structure.
 *
 * @typedef {Object} FieldTokenType
 * @property {boolean} isField - Indicates that this token type is associated with a field.
 * @property {*} value - Contains the value corresponding to the field.
 * @property {string} field - The name of the field this token type is associated with.
 * @property {{ name: string }} def - Provides the definition object for the field, including its name.
 * @property {undefined} height - A reserved property that is currently set to undefined.
 */
type FieldTokenType = {
    isField: true;
    value: any;
    field: string;
    def: { name: string };
    height: undefined
};



/**
 * A React component for viewing approval messages. This component displays a formatted message
 * based on tokens retrieved from the provided AppLedgerVBProps `vb` instance. It also allows
 * users to interact with message fields to navigate to specific properties in the data structure.
 *
 * @param {AppLedgerVBProps} props An object containing the `vb` property which provides the necessary
 *        methods for fetching and interacting with the approval message.
 *        - `vb.getApprovalMessage(height: number): FieldTokenType[]` - Retrieves the tokens of the approval message.
 *        - `vb.getHeight(): number` - Gets the current height to use with the approval message.
 * @return {ReactElement} Returns a React component displaying the approval message and enabling interactivity for fields.
 */
function ApprovalMessageViewer({applicationLedger}: AppLedgerVBProps) {
    const [approvalMessageContent, setApprovalMessageContent] = useState<ReactElement>(<Skeleton/>);
    const setPath = useSetRecoilState(pathState);
    const setHeight = useSetRecoilState(heightState);
    const setDataViewEnabled = useSetRecoilState(dataViewEnabledState);


    function goToProperty(token: FieldTokenType) {
        const paths = token.def.name.split('.');
        const lastItem = paths.pop() as string;
        const isObjet = typeof token.value === 'object' && !Array.isArray(token.value);
        setPath(isObjet ? [...paths, lastItem] : paths)
        setHeight(token.height)
        setDataViewEnabled(true);
    }


    function renderFieldToken(token: FieldTokenType): string {
        const value = token.value;
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
            if (value.length === 0) return ''
            if (typeof value[0] === 'string') return value.join(', ')
        }
        return `${token.field}`
    }

    function renderApprovalMessage() {
        const tokens = []; //vb.getApprovalMessage(vb.getHeight()); // TODO implement approval message
        const approvalMessage = tokens.map((token, i) => {
            if (token.isField) {
                const renderedToken = renderFieldToken(token);
                const onClick = () => goToProperty(token);
                return <span className={"underline hover:cursor-pointer"} onClick={onClick} key={i}>
                    {renderedToken}
                </span>
            } else {
                return <span key={i}>{token.value}</span>
            }
        })
        return <p className="p-2 bg-gray-100 rounded-md h-full overflow-auto">
            {approvalMessage}
        </p>
    }

    useEffect(() => {
        setApprovalMessageContent(renderApprovalMessage())
    }, []);


    return <div className={"flex flex-col h-full min-h-0"}>
        <p className="font-bold">Approval message</p>
        {approvalMessageContent}
    </div>
}

/**
 * Compares two numbers and returns the larger of the two.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @return {number} The larger of the two numbers.
 */
function max(a: number, b: number) {
    return a < b ? b : a
}

function min(a: number, b: number) {
    return a < b ? a : b
}

/**
 * Renders a viewer component for displaying and navigating through record data.
 *
 * @param {AppLedgerVBProps} props - The component's properties.
 * @param {object} props.vb - The virtualized block providing access to record data and navigation methods.
 * @return {JSX.Element} A React JSX Element that renders the data viewer UI, including navigation controls and a data table.
 */
function RecordDataViewer({applicationLedger}: AppLedgerVBProps) {
    const [height, setHeight] = useRecoilState(heightState);
    const [path, setPath] = useRecoilState(pathState);
    const vb = applicationLedger.getVirtualBlockchain();
    const maxH = vb.getHeight();
    const h = height ?? vb.getHeight();
    const {loading, error, value: record} = useAsync(async () => {
        return await applicationLedger.getRecord(h);
    }, [h])


    function goToStart() {
        setHeight(1)
    }

    function goToPrev() {
        setHeight(height => max(height ? height - 1 : h - 1, 1));
    }

    function goToNext() {
        setHeight(height => min(height ? height + 1 : h + 1, maxH));
    }

    function goToEnd() {
        setHeight(maxH)
    }

    // Icons for navigation buttons
    const navButtons = [
        {icon: <KeyboardDoubleArrowLeft fontSize="small" />, tooltip: "Begin", onClick: goToStart, disabled: h === 1},
        {icon: <KeyboardArrowLeft fontSize="small" />, tooltip: "Previous", onClick: goToPrev, disabled: h === 1},
        {icon: <KeyboardArrowRight fontSize="small" />, tooltip: "Next", onClick: goToNext, disabled: h == maxH},
        {icon: <KeyboardDoubleArrowRight fontSize="small" />, tooltip: "End", onClick: goToEnd, disabled: h == maxH},
    ]



    if (loading) return <Skeleton/>
    const data = path.reduce((r, item) => r[item], record)
    return <div className={"flex flex-col space-y-2 h-full"}>
        <Box className="flex justify-between items-center">
            <Typography variant="body2" className="font-medium text-gray-700">
                Block {h}/{maxH}
            </Typography>
            <Box className="flex space-x-1">
                {navButtons.map((b, i) => (
                    <Tooltip key={i} title={b.tooltip}>
                        <span>
                            <IconButton 
                                size="small" 
                                disabled={b.disabled} 
                                onClick={b.onClick}
                                className="p-1"
                            >
                                {b.icon}
                            </IconButton>
                        </span>
                    </Tooltip>
                ))}
            </Box>
        </Box>
        <PopupJsonViewer data={data} initialPath={path} key={h}/>
    </div>
}


