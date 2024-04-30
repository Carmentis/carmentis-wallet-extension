import {useEffect, useState} from 'react';
import {getComponentStack, goBack, goTo, Link} from "react-chrome-extension-router";
import InitPassword from "./InitPassword.tsx";
import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import * as React from "react";
import secureLocalStorage from "react-secure-storage";
import Index from "@/entrypoints/popup/screens/Index.tsx";


function ShowMnemonic() {

    const words = [
        'word1',
        'word2',
        'word3',
        'word4',
        'word5',
        'word6',
        'word7',
        'word8',
        'word9',
        'word10',
        'word11',
        'word12'
    ]

    return (
        <>
            <div>

                <p>
                    Write down these words in the correct order and keep them safe. You will need them to recover your wallet.
                </p>
                <div className={"w-1/2 mb-5"}>
                    {words.map((word, index) => {
                        return <span key={index} className="bg-gray-100 p-2 m-2 rounded">{word}</span>
                    })}
                </div>
                <Button onClick={() => goTo(Index)}>
                    Continue
                </Button>
            </div>
        </>
    );
}

export default ShowMnemonic;
