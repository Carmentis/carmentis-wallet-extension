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

import {Application, MicroBlock} from "@/src/Account.tsx";

export class AccountHistoryWriter {
    constructor( private  applicationByApplicationId: { [key: string]: Application  } ) {}

    /**
     * Add a new block in the history.
     *
     * @param applicationId
     * @param flowId
     * @param block
     *
     * @returns boolean at true if a modification has been applied, false otherwise.
     */
    addMicroBlock( applicationId : string, flowId : string, block : MicroBlock ) : boolean {

        // check that the specified application exists
        if ( !this.applicationByApplicationId[applicationId] ) {
            throw new Error("Application " + applicationId + " not found");
        }

        // check that the flow exists
        const application = this.applicationByApplicationId[applicationId];
        if ( !application.microBlocksByFlowId[flowId] ) {
            throw new Error("Flow " + flowId + ` not found in application ${applicationId}.`);
        }

        // the update should occur in two specific cases:
        // 1. The block exists but the master block is missing, meaning that this wallet has initiated this block but
        //      is waiting for a confirmation on the anchored.
        const blocks = application.microBlocksByFlowId[flowId];
        let indexToPlace = 0;
        for (const existingBlock of blocks) {
            // increment the index in which the block to be added will be placed to ensure a chronological chain.
            if ( existingBlock.nonce < block.nonce ) {
                indexToPlace++;
            }


            if ( existingBlock.microBlockId === block.microBlockId && existingBlock.masterBlock === undefined ) {
                // update the protocol
                console.log("[history writer] Update of the existing block with:", block)
                existingBlock.masterBlock = block.masterBlock;
                return true
            } else if ( existingBlock.microBlockId === block.microBlockId && existingBlock.masterBlock !== undefined ) {
                // the block exists and the master block is defined, nothing to do here
                return false
            }
        }


        // 2. The block do not exist, in such case the block is anchored and initiated by another.
        // The block should be inserted at the right place.
        console.log(`[history writer] Add a new block at index ${indexToPlace}: `, block)
        blocks.splice(indexToPlace, 0, block);

        return true;
    }
}