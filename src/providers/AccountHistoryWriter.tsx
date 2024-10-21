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