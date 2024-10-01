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
const wordsList = Carmentis.generateWordList(12)

// generate three random numbers corresponding to the list of
let a = 0;
let b = 0;
let c = 0;
do {
    a = randomIntFromInterval(0, 11);
    b = randomIntFromInterval(0, 11);
    c = randomIntFromInterval(0, 11);
} while (a == b || b == c || a == c);
let challengeIndexes = [a,b,c];

export function RecoveryPhrase() {
    // create a list of states
    let wordStates: string[] = [];
    let setWords = [];
    for (let i = 0; i < 12; i++) {
        let [word, setWord] = useState(wordsList[i]);
        wordStates.push(word);
        setWords.push(setWord);
    }

    // create an array of indexes.
    let indexes = [];
    for (let i = 0; i < wordsList.length; i++) {indexes.push(i);}

    // create a state to get the consent of the user
    let [consent, setConsent] = useState(false);

    // create the state defining if the challenge is started and is completed
    let [challengeStarted, setChallengeStarted] = useState(false);
    let [challengeCompleted, setChallengeCompleted] = useState(false);


    /**
     * Put the words in the clipboard.
     */
    function putWordsInClipboard() {
        // concat all the words into a string
        const concatWords = wordsList.reduce((acc : string, word : string) => {
            return acc + " " + word
        });

        // put the words in the clipboard
        navigator.clipboard.writeText(concatWords);
    }


    /**
     * Event function executed when the user clicks on continue to start the challenge.
     */
    function startChallenge() {
        // do not start the challenge while the consent is not approved
        if (!consent) return;

        // start the challenge
        setChallengeStarted(true);

        // clear the inputs
        for (let i = 0; i < 12; i++) {
            if (challengeIndexes.includes(i)) {
                setWords[i]("")
            } else {
                setWords[i](wordsList[i]);
            }
        }
    }

    /**
     * Event function executed when a challenge word is modified.
     */
    function onChallengeWordsChanged(evt, wordIndex) {
        const changedValue = evt.target.value;
        wordStates[wordIndex] = changedValue;
        setWords[wordIndex](changedValue);
        setChallengeCompleted(isChallengeComplete());
    }


    /**
     * Defines when the challenge is complete by the user.
     */
    function isChallengeComplete() {
        for ( let index = 0; index < wordsList.length; index++ ) {
            const word = wordStates[index];
            const referenceWord = wordsList[index];
            if (word !== referenceWord) {
                return false;
            }
        }
        return true;
    }

    /**
     * Function executed when the user click on the "Continue" button once the challenge is completed.
     */
    function onChallengeCompleted() {
        // check that the challenge is indeed completed!
        if (isChallengeComplete()) {
            // TODO store the seed
        }
    }


    return (
        <>
            <h1 className="title justify-center align-content-center align-items-center flex">Save your passphrase</h1>
            <p className="text-justify mb-8">
                These words constitute your passphrase to recover your wallet in case you do not remember your password.
                Your password is secret and should never be transmitted to another user.

                Note these words carefully in a secure place.
            </p>

            <div className="flex  flex-wrap mb-4">
                {indexes.map(index => (
                        <div className="word-group lg:w-1/3 md:w-1/3 mb-4 h-12">
                            <label htmlFor={"w" + index}>{index + 1}</label>

                            <input type="text"
                                   id = {"w" + index}
                                   readOnly={!challengeIndexes.includes(index)}
                                   onChange={(e) => onChallengeWordsChanged(e, index)}
                                   value={wordStates[index]}
                                   className={"word-input " + (
                                       challengeStarted && challengeIndexes.includes(index) && wordStates[index] !== wordsList[index] ?
                                           "border-green-400 ring-green-400" : ""
                                   )}
                            />
                        </div>
                ))
                }
            </div>


            {!challengeStarted &&
                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox"
                           value={consent}
                           onChange={(e) => setConsent(e.target.checked)}
                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox"
                           className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I understand that Carmentis cannot help me to recover the password.
                    </label>

                </div>
            }

            <div className="flex justify-center">
                {!challengeStarted &&
                    <button className="btn-primary mr-4" onClick={putWordsInClipboard}>Copy</button>
                }

                {!challengeStarted &&
                    <button className="btn-primary btn-highlight" onClick={startChallenge}>Continue</button>
                }
                {challengeStarted &&
                    <button className={"btn-primary " + (challengeCompleted ? "btn-highlight" : "")}
                            onClick={onChallengeCompleted}>Continue</button>
                }

            </div>
        </>
    );
}