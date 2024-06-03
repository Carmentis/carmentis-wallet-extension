import {useState} from "react";
import Button from "@/components/Button.tsx";
import Header from "@/components/Header.tsx";
import {Tag, WithContext as ReactTags} from 'react-tag-input';
// @ts-ignore
import * as Carmentis from "@/lib/carmentis-nodejs-sdk.js";
import Wallet from "@/entities/Wallet.ts";
import {goTo} from "react-chrome-extension-router";
import InitPassword from "@/entrypoints/popup/screens/InitPassword.tsx";
import {retrieveWallet} from "@/hooks/retrieveWallet.tsx";



const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

function PromptMnemonic() {
    const [tags, setTags] = useState<Tag[]>([]);

    const wallet = retrieveWallet();

    const [isPasted, setIsPasted] = useState(false);

    const handleDelete = (i: number) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag: { id: string; text: string; }) => {
        //if(isPasted) {
         //   set =
        //}else{
            setTags([...tags, tag]);
        //}
    };

    const handleDrag = (tag: { id: string; text: string; }, currPos: number, newPos: number) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        setTags(newTags);
    };

    const handleTagClick = (index: string) => {
        console.log('The tag at index ' + index + ' was clicked');
    };

    let x = 0;

    const suggestions = Carmentis.getMatchingWords('').map((word: string) => {
        return {id: (x++).toString(), text: word};
    });

    addEventListener("paste", (e) => {
        setTags(
            e.clipboardData ?
            e.clipboardData.getData('text').split(' ').map((word: string) => {
                return {id: (x++).toString(), text: word};
            }) : []
        )
    });

    return (
        <>
            <Header canGoBack={true}/>
                <div className="tags-container">
                    <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        delimiters={delimiters}
                        placeholder="Enter your words here"
                        minQueryLength={1}
                        allowDragDrop={false}
                        allowAdditionFromPaste
                    />
                </div>
            {tags.length === 12 && (
                <Button onClick={() => {
                    const mnemonic = tags.map(tag => tag.text);
                    console.log('Mnemonic', mnemonic)
                    const masterKey = Carmentis.deriveFromWordList(mnemonic);
                    const seed = Carmentis.getSeedFromWordList(mnemonic);

                    goTo(InitPassword, {seed: seed});
                }}>
                    Continue with existing wallet
                </Button>
            )}
        </>
    );
}

export default PromptMnemonic;
