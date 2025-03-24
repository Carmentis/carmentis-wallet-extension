import {useToast} from "@/entrypoints/components/authentication-manager.tsx";
import {
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Link,
    Table,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import React, {useState, useRef} from "react";
import "react-toastify/dist/ReactToastify.css";
import {UploadFile} from "@mui/icons-material";
import {useAsync} from "react-use";
import {proofLoader} from "@cmts-dev/carmentis-sdk/client";
import {SpinningWheel} from "@/entrypoints/components/SpinningWheel.tsx";
import {BlockViewer} from "@/entrypoints/components/popup/popup-event-approval.tsx";
import {useWallet} from "@/entrypoints/contexts/authentication.context.tsx";
import {ErrorBoundary} from "react-error-boundary";


export default function ProofChecker() {
    const [proof, setProof] = useState<Record<string, any> | undefined>();
    return <>
        <Breadcrumbs>
            <Typography>Proof checker</Typography>
        </Breadcrumbs>
        <ErrorBoundary fallback={<ProofCheckerFailure error={"Test"}/>} >
            { proof ? <ProofViewer proof={proof} resetProof={() => setProof(undefined)}/> : <ProofCheckerUpload onUpload={proof => setProof(proof)} /> }
        </ErrorBoundary>
    </>
}



function ProofCheckerFailure({error}: { error: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                padding: 4,
            }}
        >
            <Box
                sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 3,
                }}
            >
                <Typography variant="h1" color="error">
                    😞
                </Typography>
            </Box>
            <Typography variant="h6" color="error" gutterBottom>
                Sorry, we cannot verify the proof.
            </Typography>
            <Typography variant="body1" sx={{marginBottom: 2}}>
                The proof might be malformed.
            </Typography>
        </Box>
    );
}



function ProofCheckerUpload( {onUpload }: { onUpload: (proof: any) => void }) {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result as string);
                    onUpload(content);
                } catch (error) {
                    toast.error("Invalid JSON file. Please upload a valid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex justify-center items-center h-[500px]">
            <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
            />
            <div
                className="flex justify-center items-center w-72 h-72 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadFile scale={4}/>
            </div>
        </div>
    );
}

function ProofViewer({proof, resetProof}: {resetProof: () => void, proof: Record<string, any>}) {
    const wallet = useWallet();
    const state = useAsync(async () => {
        let loader = new proofLoader(proof);
        try {
            const records = await loader.load();
            return { verified: true, records: records.records }
        } catch (error) {
            console.error(error)
            return { verified: false, records: undefined }
        }

    })

    if (state.loading) return <>Checking the proof...</>;
    if (state.error || !state.value) return <>Proof verification failure: ${state.error}</>
    const data = state.value;
    const header = proof.information;
    const appLedgerId = proof.proofData.appLedgerId;
    const rows = [
        { header: "Proof Verification Status", value: <Chip label={data.verified ? 'Succeed' : 'Failed'} color={data.verified ? 'success' : 'error'}/>  },
        { header: "Proof Title", value: header.title },
        { header: "Proof export time", value: header.exportTime },
        { header: "Virtual Blockchain Id", value: <Link href={`${wallet.explorerEndpoint}/explorer/virtualBlockchain/${appLedgerId}`} target={"_blank"}>{appLedgerId}</Link> },
        { header: "Application", value: header.application },
        { header: "Operator", value: header.applicationOperator },
    ]
    return <>
        <Box sx={{my: 4}}>
            <Button variant={"contained"} onClick={() => resetProof()}>Verify another proof</Button>
        </Box>
       <Card>
           <CardContent>
               <Table>
                   {rows.map((value, index) =>
                       <TableRow key={index}>
                           <TableCell>{value.header}</TableCell>
                           <TableCell>{value.value}</TableCell>
                       </TableRow>
                   )}
               </Table>
               { data.records && <ProofRecordViewer records={data.records} /> }
           </CardContent>
       </Card>
    </>
}


function ProofRecordViewer( {records}: {records: {height: number, record: Record<string, any>}[] } ) {

    const content = []
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        content.push( <Card>
            <CardContent>
                <Typography variant={"h6"}>Block {record.height}</Typography>
                <BlockViewer initialPath={[]} data={record.record}/>
            </CardContent>
        </Card>)
    }
    return <>
        <Typography variant={"h6"} className={"mt-4"}>Proof Data Visualisation</Typography>
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}
        >
            {content.map((item,i) => {
                return  <TimelineItem key={i}>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        {item}
                    </TimelineContent>
                </TimelineItem>
            })}
        </Timeline>
    </>
}