import {Typography} from "@mui/material";
import React from "react";
import {version as walletVersion, dependencies} from '../../../../../package.json';

export function Versions() {
    const sdkVersion = '@cmts-dev/carmentis-sdk' in dependencies ? dependencies['@cmts-dev/carmentis-sdk'] : '--';
    return  <div className={"flex flex-col gap-2"}>
        <Typography>
            <Typography component={"span"} className={"font-bold"}>Wallet Version: </Typography>
            <Typography component={"span"}>{walletVersion}</Typography>
        </Typography>
        <Typography>
            <Typography component={"span"} className={"font-bold"}>Carmentis SDK Version: </Typography>
            <Typography component={"span"}>{sdkVersion}</Typography>
        </Typography>
    </div>
}