import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {activeAccountState, useWallet, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {
    ChevronRight,
    KeyboardArrowDown,
    KeyboardArrowUp,
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
} from "@/entrypoints/components/popup/popup-even-approval.state.ts";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse} from "@/entrypoints/background.ts";
import {Splashscreen} from "@/entrypoints/components/Splashscreen.tsx";
import {AccountDataStorage} from "@/utils/db/account-data-storage.ts";
import {
    AcceptDeclineButtonsFooter,
    OriginAndDateOfCurrentRequest,
    PopupNotificationLayout, useAccept, useActiveAccount, useClearClientRequest, useUserKeyPair
} from "@/entrypoints/components/popup/popup-dashboard.tsx";

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
    const clientRequest = useRecoilValue(clientRequestSessionState);
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data);
    const [ready, setReady] = useState(false);
    const virtualBlockchainRef = useRef<sdk.blockchain.appLedgerVb | null>(null);
    const [dataViewEnabled, setDataViewEnabled] = useRecoilState(dataViewEnabledState);
    const setError = useSetRecoilState(errorState);

    useEffect(() => {
        setDataViewEnabled(true);
        const loadRequest = async () => {
            const keyPair = await genKeyPair();
            const sk = Encoders.ToHexa(keyPair.privateKey);
            sdk.blockchain.blockchainCore.setUser(sdk.blockchain.ROLES.USER, sk);
            wiWallet.getApprovalData(sk, req.object)
                .then(async (binaryData) => {
                    let res = await sdk.blockchain.blockchainManager.checkMicroblock(
                        binaryData,
                        {
                            ignoreGas: true
                        }
                    );
                    virtualBlockchainRef.current = res.vb;
                    console.log("chain id:", res.vb.id)
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
        const keyPair = await getUserKeyPair(wallet!, activeAccount!);
        const sk = Encoders.ToHexa(keyPair.privateKey);
        const signature = await vb.signAsEndorser();
        try {
            const answer = await wiWallet.sendApprovalSignature(sk, req.object, signature);


            // store the virtual blockchain id in which the user is involved
            const db = await AccountDataStorage.connectDatabase(activeAccount!);
            await db.storeApplicationVirtualBlockchainId(answer.walletObject.vbHash)

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
    const vb: sdk.blockchain.appLedgerVb = virtualBlockchainRef.current!;

    let header = <></>;
    let body = <></>;
    const footer = <Box sx={{display: "flex", flexDirection: "column", width: "100%"}} className={"space-y-2"} >
        <Button
            fullWidth={true}
            className={"uppercase"}
            variant={"outlined"}
            onClick={() => setDataViewEnabled(!dataViewEnabled)}>
            { dataViewEnabled ? "Back" : "Browse Data" }
        </Button>
        <AcceptDeclineButtonsFooter accept={accept}/>
    </Box>
    if (dataViewEnabled) {
        header = <></>;
        body = <>
            <div className={"flex-grow h-full"}>
                <RecordDataViewer vb={vb}/>
            </div>

        </>
    } else {
        header = <>
            <Typography variant={"h6"}>Approval Request</Typography>
            <p>
                An application wants you to approve an event.
            </p>
        </>
        body = <>
            <OriginAndDateOfCurrentRequest/>
            <div className={"flex-grow"}>
                <ApprovalMessageViewer vb={vb}/>
            </div>

        </>
    }
    return <PopupNotificationLayout header={header} body={body} footer={footer}/>
}

/**
 * Defines the properties required for the AppLedgerVBProps type.
 *
 * @typedef {Object} AppLedgerVBProps
 * @property {sdk.blockchain.appLedgerVb} vb - Represents a virtual blockchain ledger component used in the application.
 */
type AppLedgerVBProps = { vb: sdk.blockchain.appLedgerVb }

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
function ApprovalMessageViewer({vb}: AppLedgerVBProps) {
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
        const tokens = vb.getApprovalMessage(vb.getHeight());
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
function RecordDataViewer({vb}: AppLedgerVBProps) {
    const [height, setHeight] = useRecoilState(heightState);
    const [path, setPath] = useRecoilState(pathState);
    const maxH = vb.getHeight();
    const h = height ?? vb.getHeight();
    const record = vb.getRecord(h);
    const data = path.reduce((r, item) => r[item], record)


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

    const buttons = [
        {label: "Begin", onClick: goToStart, disabled: h === 1},
        {label: "Previous", onClick: goToPrev, disabled: h === 1},
        {label: "Next", onClick: goToNext, disabled: h == maxH},
        {label: "End", onClick: goToEnd, disabled: h == maxH},
    ]

    return <div className={"flex flex-col space-y-2 h-full"}>
        <p className="font-bold">Data (block {h}/{maxH})</p>
        <ButtonGroup variant="contained" fullWidth={true} aria-label=" uppercase outlined primary button group">
            {buttons.map((b, i) => <Button size={'small'} key={i} disabled={b.disabled} onClick={b.onClick}>{b.label}</Button>)}
        </ButtonGroup>
        <BlockViewer data={data} initialPath={path} key={h}/>
    </div>
}


export function BlockViewer({data, initialPath}: {data: Record<string, any>, initialPath: string[]}) {
    const [path, setPath] = useState(initialPath);
    const [shownData, setShowData] = useState(data);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // compute the shown data
        let shownData = data;
        for (const token of path) {
            shownData = shownData[token];
        }
        setShowData(shownData);
        // Reset expanded items when path changes
        setExpandedItems({});
    }, [path, data]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    const toggleExpand = (key: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    function navigateToPath(key: string) {
        setPath(p => [...p, key]);
    }

    function backPath() {
        if (path.length > 0) {
            const newPath = [...path];
            newPath.pop();
            setPath(newPath);
        }
    }

    function getDataTypeIcon(value: any) {
        if (typeof value === 'string') return <TextFields fontSize="small" className="text-blue-500" />;
        if (typeof value === 'number') return <Numbers fontSize="small" className="text-green-500" />;
        if (Array.isArray(value)) return <List fontSize="small" className="text-purple-500" />;
        if (value instanceof Date) return <CalendarToday fontSize="small" className="text-orange-500" />;
        if (typeof value === 'object' && value !== null) return <Code fontSize="small" className="text-indigo-500" />;
        return <ErrorIcon fontSize="small" className="text-red-500" />;
    }

    function getValuePreview(value: any) {
        if (value === null) return <span className="text-gray-400">null</span>;
        if (value === undefined) return <span className="text-gray-400">undefined</span>;

        if (typeof value === 'string') {
            return <span className="text-blue-600 font-mono">{value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-green-600 font-mono">{value}</span>;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-gray-400">[]</span>;
            if (value.every(v => typeof v === 'string')) {
                return <span className="text-purple-600 font-mono">[{value.slice(0, 3).join(', ')}{value.length > 3 ? `, ... +${value.length - 3} more` : ''}]</span>;
            }
            return <span className="text-purple-600 font-mono">[{value.length} items]</span>;
        }

        if (value instanceof Date) {
            return <span className="text-orange-600 font-mono">{value.toLocaleString()}</span>;
        }

        if (typeof value === 'object') {
            const keys = Object.keys(value);
            return <span className="text-indigo-600 font-mono">
                {`{${keys.slice(0, 2).join(', ')}${keys.length > 2 ? `, ... +${keys.length - 2} more` : ''}}`}
            </span>;
        }

        return <span className="text-gray-600">{String(value)}</span>;
    }

    function renderBreadcrumbs() {
        if (path.length === 0) return null;

        return (
            <motion.div 
                className="flex items-center flex-wrap mb-2 p-2 bg-gray-50 rounded-md overflow-x-auto"
                variants={itemVariants}
            >
                <span 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
                    onClick={() => setPath([])}
                >
                    <KeyboardBackspace fontSize="small" className="mr-1" />
                    root
                </span>

                {path.map((segment, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight fontSize="small" className="mx-1 text-gray-400" />
                        <span 
                            className={`${index === path.length - 1 ? 'text-gray-700 font-medium' : 'text-blue-600 hover:text-blue-800 cursor-pointer'}`}
                            onClick={() => index < path.length - 1 ? setPath(path.slice(0, index + 1)) : null}
                        >
                            {segment}
                        </span>
                    </React.Fragment>
                ))}
            </motion.div>
        );
    }

    function renderExpandableValue(key: string, value: any, index: number) {
        const isExpanded = expandedItems[key] || false;
        const isObject = typeof value === 'object' && value !== null;
        const isArray = Array.isArray(value);
        const isExpandable = isObject || isArray;

        return (
            <motion.div 
                key={index}
                variants={itemVariants}
                className="border border-gray-100 rounded-md mb-2 overflow-hidden"
            >
                <div 
                    className={`flex items-center justify-between p-3 ${isExpandable ? 'cursor-pointer hover:bg-gray-50' : ''} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    onClick={isExpandable ? () => toggleExpand(key) : undefined}
                >
                    <div className="flex items-center space-x-2 overflow-hidden">
                        {getDataTypeIcon(value)}
                        <span className="font-medium text-gray-700 truncate">{key}</span>
                    </div>

                    <div className="flex items-center">
                        <div className="text-gray-600 mr-2 max-w-xs truncate">
                            {getValuePreview(value)}
                        </div>

                        {isExpandable ? (
                            isExpanded ? (
                                <KeyboardArrowUp fontSize="small" className="text-gray-500" />
                            ) : (
                                <KeyboardArrowDown fontSize="small" className="text-gray-500" />
                            )
                        ) : null}

                        {isObject && !isArray && !isExpanded && (
                            <Button 
                                size="small" 
                                variant="text" 
                                className="ml-2 text-blue-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToPath(key);
                                }}
                            >
                                Navigate
                            </Button>
                        )}
                    </div>
                </div>

                {isExpanded && isExpandable && (
                    <div className="p-3 border-t border-gray-100 bg-white">
                        {isArray ? (
                            <div className="space-y-2">
                                {value.slice(0, 10).map((item: any, i: number) => (
                                    <div key={i} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-500 mr-2">{i}:</span>
                                        <div>{getValuePreview(item)}</div>
                                    </div>
                                ))}
                                {value.length > 10 && (
                                    <div className="text-center text-gray-500 p-2">
                                        + {value.length - 10} more items
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(value).slice(0, 10).map(([subKey, subValue], i) => (
                                    <div key={i} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-700 font-medium mr-2 min-w-[100px]">{subKey}:</span>
                                        <div>{getValuePreview(subValue)}</div>
                                    </div>
                                ))}
                                {Object.keys(value).length > 10 && (
                                    <div className="text-center text-gray-500 p-2">
                                        + {Object.keys(value).length - 10} more properties
                                    </div>
                                )}
                                <div className="text-center mt-2">
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        className="text-blue-600"
                                        onClick={() => navigateToPath(key)}
                                    >
                                        View Full Object
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    }

    function renderEmptyState() {
        return (
            <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-8 text-center"
            >
                <MoreHoriz className="text-gray-400 text-5xl mb-4" />
                <Typography variant="h6" className="text-gray-700 mb-2">
                    Empty Object
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    This object doesn't contain any properties
                </Typography>
                {path.length > 0 && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        className="mt-4"
                        startIcon={<KeyboardBackspace />}
                        onClick={backPath}
                    >
                        Go Back
                    </Button>
                )}
            </motion.div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto">
            {renderBreadcrumbs()}

            <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-3"
                >
                    {Object.keys(shownData).length === 0 ? (
                        renderEmptyState()
                    ) : (
                        Object.entries(shownData).map(([key, value], index) => 
                            renderExpandableValue(key, value, index)
                        )
                    )}
                </motion.div>
            </Paper>
        </div>
    );
}
