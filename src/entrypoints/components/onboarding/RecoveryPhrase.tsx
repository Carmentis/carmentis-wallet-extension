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

import React, { Dispatch, SetStateAction, useState } from "react";
import { CarmentisProvider } from "@/providers/carmentisProvider.tsx";
import { useLocation, useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import { onboardingSeedAtom } from "@/entrypoints/components/onboarding/onboarding.state.ts";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, ShieldLock, CheckCircle, ExclamationTriangle, ArrowRight } from "react-bootstrap-icons";

/**
 * Generate a random number included between the two provided (included) bounds.
 *
 * @param min The lowest value the function can sample.
 * @param max The highest value the function can sample.
 *
 * @return number A randomly chosen number between `min` and `max`.
 */
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// generate a list of words
const provider = new CarmentisProvider();
const wordsList = provider.generateWords();

// generate three random numbers corresponding to the list of
let a = 0;
let b = 0;
let c = 0;
do {
  a = randomIntFromInterval(0, 11);
  b = randomIntFromInterval(0, 11);
  c = randomIntFromInterval(0, 11);
} while (a == b || b == c || a == c);
let challengeIndexes = [a, b, c];

export function RecoveryPhrase() {
  const navigate = useNavigate();
  const location = useLocation();

  // create a list of states
  let wordStates: string[] = [];
  let setWords: Dispatch<SetStateAction<string>>[] = [];
  for (let i = 0; i < 12; i++) {
    let [word, setWord] = useState(wordsList[i]);
    wordStates.push(word);
    setWords.push(setWord);
  }

  // create an array of indexes.
  let indexes = [];
  for (let i = 0; i < wordsList.length; i++) {
    indexes.push(i);
  }

  // State management
  const [consent, setConsent] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setSeed = useSetRecoilState(onboardingSeedAtom);

  /**
   * Put the words in the clipboard.
   */
  function putWordsInClipboard() {
    // concat all the words into a string
    const concatWords = wordsList.reduce((acc: string, word: string) => {
      return acc + " " + word;
    });

    // put the words in the clipboard
    navigator.clipboard.writeText(concatWords);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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
        setWords[i]("");
      } else {
        setWords[i](wordsList[i]);
      }
    }
  }

  /**
   * Event function executed when a challenge word is modified.
   */
  function onChallengeWordsChanged(evt: React.ChangeEvent<HTMLInputElement>, wordIndex: number) {
    const changedValue = evt.target.value;
    wordStates[wordIndex] = changedValue;
    setWords[wordIndex](changedValue);
    setChallengeCompleted(isChallengeComplete());
  }

  /**
   * Defines when the challenge is complete by the user.
   */
  function isChallengeComplete() {
    for (let index = 0; index < wordsList.length; index++) {
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
      setIsSubmitting(true);
      try {
        // generate an encrypted seed
        let seed = await provider.generateSeed(wordsList);
        setSeed(seed);
        navigate("/setup-wallet");
      } catch (error) {
        console.error("Error generating seed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const wordVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: i * 0.03,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto"
    >
      <motion.h1 variants={itemVariants} className="title text-center mb-4">
        {challengeStarted ? "Verify your recovery phrase" : "Save your recovery phrase"}
      </motion.h1>

      <AnimatePresence mode="wait">
        {!challengeStarted ? (
          <motion.div
            key="initial-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div variants={itemVariants} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
              <div className="flex items-start">
                <ExclamationTriangle className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  These 12 words are the only way to recover your wallet if you forget your password or lose access to this device. 
                  Write them down in order and keep them in a secure place.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {indexes.map((index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={wordVariants}
                    className="flex items-center"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm bg-white py-1.5 px-2 rounded border border-gray-200 w-full text-center">
                      {wordsList[index]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consent" className="font-medium text-gray-700">
                  I have written down my recovery phrase and stored it in a secure place.
                </label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={putWordsInClipboard}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md 
                  shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy to clipboard
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startChallenge}
                disabled={!consent}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="challenge-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div variants={itemVariants} className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
              <div className="flex items-start">
                <ShieldLock className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  To verify you've saved your recovery phrase, please fill in the missing words below.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {indexes.map((index) => {
                  const isChallenge = challengeIndexes.includes(index);
                  const isCorrect = wordStates[index] === wordsList[index];

                  return (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={wordVariants}
                      className="flex flex-col"
                    >
                      <div className="flex items-center mb-1">
                        <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">
                          {index + 1}
                        </span>
                        {isChallenge && isCorrect && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </div>
                      <input
                        type="text"
                        id={`w${index}`}
                        value={wordStates[index]}
                        onChange={(e) => onChallengeWordsChanged(e, index)}
                        readOnly={!isChallenge}
                        placeholder={isChallenge ? "Enter word" : ""}
                        className={`font-mono text-sm py-1.5 px-2 rounded border ${
                          isChallenge
                            ? isCorrect
                              ? "border-green-500 bg-green-50 focus:ring-green-500"
                              : "border-gray-300 focus:ring-blue-500"
                            : "border-gray-200 bg-gray-100 text-gray-700"
                        } w-full focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onChallengeCompleted}
              disabled={!challengeCompleted || isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md 
                shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
