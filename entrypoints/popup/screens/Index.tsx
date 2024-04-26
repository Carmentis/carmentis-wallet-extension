import { useState } from 'react';
import {Link} from "react-chrome-extension-router";
import WalletCreate from "./WalletCreate.tsx";


function Index() {

    return (
        <>
            <div>

            </div>
            <h1>Carmentis</h1>
            <div className="card">
                <Link component={WalletCreate} props={{ message: 'I came from component one!' }}>
                    Create a new Carmentis Wallet
                </Link>
                <br/>
                <button  className={"mt-1"}>
                    Import a Carmentis Wallet
                </button>
            </div>
            <p className="read-the-docs">
            </p>
        </>
    );
}

export default Index;
