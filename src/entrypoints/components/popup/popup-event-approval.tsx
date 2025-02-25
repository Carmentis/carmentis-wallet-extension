import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {activeAccountState, walletState} from "@/entrypoints/contexts/authentication.context.tsx";
import {clientRequestSessionState} from "@/entrypoints/states/client-request-session.state.tsx";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {getUserKeyPair} from "@/entrypoints/main/wallet.tsx";
import {Encoders} from "@/entrypoints/main/Encoders.tsx";
import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import {
    dataViewEnabledState, errorState,
    heightState,
    pathState
} from "@/entrypoints/components/popup/popup-even-approval.state.ts";
import {BACKGROUND_REQUEST_TYPE, BackgroundRequest, ClientResponse} from "@/entrypoints/background.ts";
import {useToast} from "@/entrypoints/components/authentication-manager.tsx";
import {Splashscreen} from "@/entrypoints/components/Splashscreen.tsx";
import {AccountDataStorage} from "@/utils/db/account-data-storage.ts";

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
    const toast = useToast();
    const wallet = useRecoilValue(walletState);
    const activeAccount = useRecoilValue(activeAccountState);
    const [clientRequest, setClientRequest] = useRecoilState(clientRequestSessionState);
    console.log("Popup Event approval: ", clientRequest)
    const wiWallet = new sdk.wiExtensionWallet();
    const req = wiWallet.getRequestFromMessage(clientRequest.data);
    const [ready, setReady] = useState(false);
    const virtualBlockchainRef = useRef<sdk.blockchain.appLedgerVb | null>(null);
    const [dataViewEnabled, setDataViewEnabled] = useRecoilState(dataViewEnabledState);
    const setError = useSetRecoilState(errorState);

    useEffect(() => {
        setDataViewEnabled(true);
        const loadRequest = async () => {
            const keyPair = await getUserKeyPair(wallet!, activeAccount!);
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
                    setClientRequest(undefined);
                    console.error(e);
                    setError(e.message);
                });
        };

        loadRequest();


        return () => {
            setClientRequest(undefined);
        }
    }, []);


    async function accept() {
        const keyPair = await getUserKeyPair(wallet!, activeAccount!);
        const sk = Encoders.ToHexa(keyPair.privateKey);
        const signature = await vb.signAsEndorser();
        console.log("test")
        const answer = await wiWallet.sendApprovalSignature(sk, req.object, signature);

        // store the virtual blockchain id in which the user is involved
        const db = await AccountDataStorage.connectDatabase(activeAccount!);
        await db.storeApplicationVirtualBlockchainId(answer.walletObject.vbHash)

        // clear the current request
        setClientRequest(undefined);
        const response: BackgroundRequest<ClientResponse> = {
            backgroundRequestType: BACKGROUND_REQUEST_TYPE.CLIENT_RESPONSE,
            payload: answer.clientAnswer
        }

        console.log("[popup dashboard] Response:", response)
        browser.runtime.sendMessage(response);
    }

    function decline() {
        setClientRequest(undefined);
    }

    if (!ready) return <Splashscreen label={"Request loading..."}/>
    const vb: sdk.blockchain.appLedgerVb = virtualBlockchainRef.current!;

    let header = <></>;
    let body = <></>;
    if (dataViewEnabled) {
        header = <>
            <Typography variant={"h6"}>Approval Request</Typography>
        </>;
        body = <>
            <div>
                <ApprovalMessageViewer vb={vb}/>
            </div>
            <div className={"flex-grow"}>
                <RecordDataViewer vb={vb}/>
            </div>
            <Button className={"uppercase w-full"} variant={"outlined"}
                    onClick={() => setDataViewEnabled(false)}>Back</Button>
        </>
    } else {
        header = <>
            <Typography variant={"h6"}>Approval Request</Typography>
            <p>
                An application wants you to approve an event.
            </p>
        </>
        body = <>
            <div>
                <p className="font-bold">Origin</p>
                <p className="w-100 p-2 bg-gray-100 rounded-md">
                    {clientRequest.origin}
                </p>
            </div>
            <div>
                <p className="font-bold">Received at</p>
                <p className="w-100 p-2 bg-gray-100 rounded-md">
                    {new Date(clientRequest.timestamp).toLocaleString()}
                </p>
            </div>
            <div className={"flex-grow"}>
                <ApprovalMessageViewer vb={vb}/>
            </div>
            <Button className={"uppercase w-full"} variant={"outlined"} onClick={() => setDataViewEnabled(true)}>browse
                data</Button>
        </>
    }


    return <div className={"h-full max-h-full w-full flex flex-col space-y-2"}>
        <div id="header">
            {header}
        </div>
        <div id="body" className={"flex-grow flex flex-col"}>
            {body}
        </div>
        <div id="footer" className={"w-full flex flex-row space-x-2 "}>
            <div className={"w-1/2"} onClick={accept}>
                <Button className={"uppercase w-full"} variant={"contained"}>Accept</Button>
            </div>
            <div className={"w-1/2"} onClick={decline}>
                <Button className={"uppercase w-full"} variant={"contained"}>decline</Button>
            </div>
        </div>
    </div>
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
        return <p className="p-2 bg-gray-100 rounded-md h-full overflow-auto max-h-[150px]">
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

    /*
    const rowEntryClass = 'w-full first:rounded-t last:rounded-b border-b-2 border-gray-50'

    function renderEntry(index: number, key: string, value: any) {
        let content;
        const isArrayOfStrings = Array.isArray(value) && value.every(v => typeof v === 'string')
        if (typeof value === 'string' || typeof value === 'number' || isArrayOfStrings) {
            content = <>
                <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                <td className={"p-1"}>{isArrayOfStrings ? value.join(', ') : value}</td>
            </>
        } else {
            // check if supported
            const isArray = Array.isArray(value);
            const isObject = typeof value === 'object';
            const isDate = value instanceof Date;
            if (!isArray && isObject) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500 hover:cursor-pointer"} onClick={() => setPath(p => {
                        return [...p, key];
                    })}>See more
                    </td>
                </>
            } else if (isDate) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>{new Date(value).toLocaleString()}</td>
                </>
            } else {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>Cannot expand</td>
                </>
            }

        }
        return <TableRow key={index} className={rowEntryClass}>
            {content}
        </TableRow>
    }

    function renderPreviousPath() {
        if (path.length == 0) return
        return <TableRow className={rowEntryClass}>
            <td onClick={() => setPath(p => {
                p.pop();
                return p;
            })}>Back
            </td>
        </TableRow>
    }

    function renderRecord() {
        const previousPath = renderPreviousPath();
        const content = Object.entries(data).map(([key, value], i) => renderEntry(i, key, value))
        return <>
            <TableContainer className={"shadow-lg"}>
                <Table component={Paper} elevation={1}>
                    <TableBody>
                        {previousPath}
                        {content}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    }

     */

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
        <BlockViewer data={data} initialPath={path}/>
    </div>
}

export function BlockViewer({data, initialPath}: {data: Record<string, any>, initialPath: string[]}) {
    const [path, setPath] = useState(initialPath)

    const rowEntryClass = 'w-full first:rounded-t last:rounded-b border-b-2 border-gray-50'
    function renderEntry(index: number, key: string, value: any) {
        let content;
        const isArrayOfStrings = Array.isArray(value) && value.every(v => typeof v === 'string')
        if (typeof value === 'string' || typeof value === 'number' || isArrayOfStrings) {
            content = <>
                <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                <td className={"p-1"}>{isArrayOfStrings ? value.join(', ') : value}</td>
            </>
        } else {
            // check if supported
            const isArray = Array.isArray(value);
            const isObject = typeof value === 'object';
            const isDate = value instanceof Date;
            if (!isArray && isObject) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500 hover:cursor-pointer"} onClick={() => setPath(p => {
                        return [...p, key];
                    })}>See more
                    </td>
                </>
            } else if (isDate) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>{new Date(value).toLocaleString()}</td>
                </>
            } else {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>Cannot expand</td>
                </>
            }

        }
        return <TableRow key={index} className={rowEntryClass}>
            {content}
        </TableRow>
    }

    function renderPreviousPath() {
        if (path.length == 0) return
        return <TableRow className={rowEntryClass}>
            <td onClick={() => setPath(p => {
                p.pop();
                return p;
            })}>Back
            </td>
        </TableRow>
    }

    function renderRecord() {
        const previousPath = renderPreviousPath();
        const content = Object.entries(data).map(([key, value], i) => renderEntry(i, key, value))
        return <>
            <TableContainer >
                <Table component={Paper} elevation={1}>
                    <TableBody>
                        {previousPath}
                        {content}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    }



    return <>{renderRecord()}</>
}


