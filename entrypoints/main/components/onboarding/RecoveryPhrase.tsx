
/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {CarmentisProvider} from "@/src/providers/carmentisProvider.tsx";
import {useLocation, useNavigate} from "react-router";

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
const provider = new CarmentisProvider();
const wordsList = provider.generateWords()

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
    // this component should be called from password definition, meaning that a password is sent as a parameter.
    // to access it, we use the location variable of react routing. If no password is provided, we back to the password
    // creation page
    const navigate = useNavigate();
    const location = useLocation()
    if (!location.state || !location.state.password || !location.state.pseudo) {

        console.log("No pseudo/password defined: go to password creation")
        useEffect(() => {
            navigate("/create-password");
        });
    }

    // create a list of states
    let wordStates: string[] = [];
    let setWords : Dispatch<SetStateAction<string>>[] = [];
    for (let i = 0; i < 12; i++) {
        let [word, setWord] = useState(wordsList[i]);
        wordStates.push(word);
        setWords.push(setWord);
    }

    // create an array of indexes.
    let indexes = [];
    for (let i = 0; i < wordsList.length; i++) {indexes.push(i);}

    // create a state to get the consent of the user
    let [consent, setConsent] = useState(0);

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
    function onChallengeWordsChanged(evt: React.ChangeEvent<HTMLInputElement>, wordIndex : number) {
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
    async function onChallengeCompleted() {
        // check that the challenge is indeed completed!
        if (isChallengeComplete()) {
            // generate an encrypted seed
            let seed = await provider.generateSeed(wordsList);
            navigate("/setup-wallet", {
                state: {
                    pseudo: location.state.pseudo,
                    password: location.state.password,
                    seed: seed,
                }
            })

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
                           onChange={(e) => setConsent(e.target.checked ? 1 : 0)}
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