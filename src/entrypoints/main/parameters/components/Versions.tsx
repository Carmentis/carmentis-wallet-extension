import React from "react";
import {version as walletVersion, dependencies} from '../../../../../package.json';

export function Versions() {
    const sdkVersion = '@cmts-dev/carmentis-sdk' in dependencies ? dependencies['@cmts-dev/carmentis-sdk'] : '--';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Wallet Version</div>
                <div className="text-base font-semibold text-gray-900">{walletVersion}</div>
            </div>
            <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Carmentis SDK Version</div>
                <div className="text-base font-semibold text-gray-900">{sdkVersion}</div>
            </div>
        </div>
    );
}