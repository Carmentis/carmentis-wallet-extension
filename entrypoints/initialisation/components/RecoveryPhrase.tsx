import * as Carmentis from "../../../lib/carmentis-nodejs-sdk.js";
import React, {useState} from "react";

/**
 * Generate a random number included between the two provided (included) bounds.
 *
 * @param min The lowest value the function can sample.
 * @param max The highest value the function can sample.
 *
 * @return number A randomly chosen number between `min` and `max`.
 */
function randomIntFromInterval(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



// generate a list of words
const wordsList = Carmentis.generateWordList(12);

export function RecoveryPhrase() {
    // create a list of states
    let wordStates = [];
    let setWords = [];
    for (let i = 0; i < 12; i++) {
        let [word, setWord] = useState(wordsList[i]);
        wordStates.push(word);
        setWords.push(setWord);
    }

    let indexes = [];
    for (let i = 0; i < wordsList.length; i++) {indexes.push(i);}


    // generate three random numbers corresponding to the list of
    let a = 0;
    let b = 0;
    let c = 0;
    do {
        a = randomIntFromInterval(0, 11);
        b = randomIntFromInterval(0, 11);
        c = randomIntFromInterval(0, 11);
    } while (a == b || a == b || a == c);


    /**
     * Event function executed when the user clicks on continue to start the challenge.
     */
    function startChallenge() {
        // clear the inputs
        for (let i = 0; i < 12; i++) {
            if (i == a || i == b || i == c) {
                setWords[i]("")
            } else {
                setWords[i](wordsList[i]);
            }
        }
    }

    /**
     * Event function executed when a challenge word is modified.
     */
    function onChallengeWordsChanged(e) {
        console.log("Challenge words changed", e)
    }


    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Save your passphrase</h1>
            <p className="text-justify mb-8">
                These words constitute your passphrase to recover your wallet in case you do not remember your password.
                Your password is secret and should never be transmitted to another user.

                Note these words carefully in a secure place.
            </p>

            <div className="flex  flex-wrap -mb-4">
                {indexes.map(index => (
                        <div className="word-group lg:w-1/3 md:w-1/3 mb-4 h-12">
                            <label htmlFor={"w" + index}>{index + 1}</label>

                            <input type="text"
                                   id = {"w" + index}
                                   readOnly={wordStates[index] != ""}
                                   onChange={onChallengeWordsChanged}
                                   value={wordStates[index]}
                                   attr-set-word={setWords[index]}
                                   className={"word-input " + (wordStates[index] === "" ? "border-green-400 ring-green-400" : "" )}
                            />
                        </div>
                ))
                }
            </div>

            <div className="row flex align-items-center justify-center align-content-center">
                <div className="btn-primary btn-highlight" onClick={startChallenge}>Continue</div>
            </div>
        </>
    );
}