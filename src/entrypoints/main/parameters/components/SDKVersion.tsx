import {Typography} from "@mui/material";
import React from "react";
import {version} from '../../../../../package.json';

export function SDKVersion() {
    const sdkVersion = version;
    return  <Typography>
        <Typography component={"span"} className={"font-bold"}>Carmentis SDK Version: </Typography>
        <Typography component={"span"}>{sdkVersion}</Typography>
    </Typography>
}