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

import Dexie, { Table } from 'dexie';
import { Account, Application, Flow, MicroBlock } from '@/entrypoints/main/Account.tsx';
import { VirtualBlockchainView } from '@/entrypoints/main/virtual-blockchain-view.tsx';
import { RecordConfirmationData } from '@/entrypoints/components/popup/PopupDashboard.tsx';
import Guard from '@/entrypoints/main/Guard.tsx';
import { IllegalStateError } from '@/entrypoints/main/errors.tsx';
import { Optional } from '@/entrypoints/main/optional.ts';
import {AppNotification} from "@/entrypoints/states/application-nofications.state.tsx";

/**
 * Class representing an indexed storage database using Dexie for managing application data.
 * The database consists of tables for applications, flows, and microBlocks.
 * Extends the Dexie class to provide methods for interacting with the database.
 */
export class ApplicationDataStorageDB extends Dexie {
    applications!: Table<Application, string>;
    flows!: Table<Flow, string>;
    microBlocks!: Table<MicroBlock, string>;
    notifications!: Table<AppNotification, string>;

    constructor(dbName: string) {
        super(dbName);
        this.version(1).stores({
            applications: 'applicationId',
            flows: 'flowId, applicationId',
            microBlocks: 'microBlockId, flowId, [flowId+nonce]',
            notifications: '++notificationId, ts'
        });
    }

    static async connectDatabase(account: Account): Promise<ApplicationDataStorageDB> {
        const dbName = `account-${account.id}`;
        return new ApplicationDataStorageDB(dbName);
    }


}

/**
 * Manages data storage for blockchain-related entities such as applications, flows, and micro-blocks.
 * Provides methods to interact with an IndexedDB database, allowing for storage, retrieval, and update operations.
 */
export class ApplicationDataStorageHelper {


    private constructor(private db: ApplicationDataStorageDB, private account: Account) {}

    /**
     * Connects to the database for the specified account and initializes a DataStorage instance.
     *
     * @param {Account} account - The account object containing the details required to connect to the database.
     * @return {Promise<ApplicationDataStorageHelper>} A promise that resolves to the initialized DataStorage instance.
     */
    static async connectDatabase(account: Account): Promise<ApplicationDataStorageHelper> {
        const dbName = `account-${account.id}`;
        const db = new ApplicationDataStorageDB(dbName);
        return new ApplicationDataStorageHelper(db, account);
    }

    /**
     * Retrieves the total number of applications from the database.
     *
     * @return {Promise<number>} A promise that resolves to the count of applications.
     */
    async getNumberOfApplications(): Promise<number> {
        return this.db.applications.count();
    }

    /**
     * Retrieves the total number of flows associated with an account.
     *
     * @return {Promise<number>} A promise that resolves to the count of flows for the account.
     */
    async getFlowsNumberOfAccount(): Promise<number> {
        return this.db.flows.count();
    }

    /**
     * Retrieves the length of the flow based on the provided flow identifier.
     *
     * @param {string} flowId - The unique identifier of the flow whose length is to be retrieved.
     * @return {Promise<number>} A promise that resolves to the count of microBlocks associated with the specified flow identifier.
     */
    async getFlowLength(flowId: string): Promise<number> {
        return this.db.microBlocks.where('flowId').equals(flowId).count();
    }

    /**
     * Retrieves an application by its unique application ID.
     *
     * @param {string} applicationId - The unique identifier of the application to retrieve.
     * @return {Promise<Application | undefined>} A promise that resolves to the application object if found, or undefined if no application is found with the given ID.
     */
    async getApplicationByApplicationId(applicationId: string): Promise<Application | undefined> {
        return this.db.applications.get(applicationId);
    }

    /**
     * Retrieves all virtual blockchain flows associated with an account.
     *
     * @return {Promise<VirtualBlockchainView[]>} A promise that resolves to an array of VirtualBlockchainView objects,
     * containing detailed information about each flow such as the application domain, application ID, application name,
     * virtual blockchain ID, flow length, and the timestamp of the last update.
     */
    async getAllFlowsOfAccount(): Promise<VirtualBlockchainView[]> {
        const flows = await this.db.flows.toArray();
        const flowViews: VirtualBlockchainView[] = [];

        for (const flow of flows) {
            const application = await this.getApplicationByApplicationId(flow.applicationId);
            if (!application) continue;

            const newestBlock = await this.getNewestBlockInFlow(flow.flowId);
            const flowView: VirtualBlockchainView = {
                applicationDomain: application.rootDomain,
                applicationId: application.applicationId,
                applicationName: application.applicationName,
                virtualBlockchainId: flow.flowId,
                flowLength: await this.getFlowLength(flow.flowId),
                lastUpdate: newestBlock?.ts || 0,
            };
            flowViews.push(flowView);
        }

        return flowViews;
    }

    /**
     * Retrieves the newest micro block in the specified flow based on the timestamp.
     *
     * @param {string} flowId - The unique identifier of the flow for which the newest block is to be retrieved.
     * @return {Promise<MicroBlock | undefined>} A promise that resolves to the newest MicroBlock if found,
     * or undefined if no blocks exist for the given flow.
     */
    async getNewestBlockInFlow(flowId: string): Promise<MicroBlock | undefined> {
        return this.db.microBlocks
            .where('flowId')
            .equals(flowId)
            .reverse()
            .sortBy('ts')
            .then(blocks => blocks[0]);
    }

    /**
     * Retrieves the total amount of gas spent across all microblocks stored in the database.
     *
     * The method fetches all microblocks from the database, iterates through them,
     * and calculates the sum of the gas values for each block.
     *
     * @return {Promise<number>} A promise that resolves to the total gas spent.
     */
    async getSpentGaz(): Promise<number> {
        const blocks = await this.db.microBlocks.toArray();
        return blocks.reduce((sum, block) => sum + block.gas, 0);
    }

    /**
     * Retrieves all microblocks associated with a specific flow ID.
     *
     * @param {string} flowId - The unique identifier of the flow for which microblocks are to be retrieved.
     * @return {Promise<MicroBlock[]>} A promise that resolves to an array of MicroBlock objects associated with the given flow ID.
     */
    async getAllBlocksByFlowId(flowId: string): Promise<MicroBlock[]> {
        return this.db.microBlocks.where('flowId').equals(flowId).toArray();
    }

    /**
     * Adds an approved block to the active account history by updating the database with the provided record details.
     *
     * @param {RecordConfirmationData} record - The confirmation data containing details such as applicationId, flowId, data, gas, gasPrice, microBlockId, nonce, and timestamp.
     * @return {Promise<void>} A promise that resolves when the approved block is successfully added to the database.
     */
    async addApprovedBlockInActiveAccountHistory(record: RecordConfirmationData): Promise<void> {
        const application: Application = {
            rootDomain: Guard.PreventUndefined(record.rootDomain),
            accountId: this.account.id,
            applicationId: Guard.PreventUndefined(record.applicationId),
            applicationName: Guard.PreventUndefined(record.applicationName),
        };

        const flow: Flow = {
            accountId: this.account.id,
            applicationId: Guard.PreventUndefined(record.applicationId),
            flowId: Guard.PreventUndefined(record.flowId),
        };

        const microBlock: MicroBlock = {
            accountId: this.account.id,
            applicationId: Guard.PreventUndefined(record.applicationId),
            data: Guard.PreventUndefined(record.data),
            flowId: Guard.PreventUndefined(record.flowId),
            gas: Guard.PreventUndefined(record.gas),
            gasPrice: Guard.PreventUndefined(record.gasPrice),
            isInitiator: true,
            masterBlock: undefined,
            microBlockId: Guard.PreventUndefined(record.microBlockId),
            nonce: Guard.PreventUndefined(record.nonce),
            ts: Guard.PreventUndefined(record.ts),
            version: Guard.PreventUndefined(record.applicationVersion),
        };

        await this.db.transaction('rw', [this.db.applications, this.db.flows, this.db.microBlocks], async () => {
            await this.db.applications.put(application);
            await this.db.flows.put(flow);
            await this.db.microBlocks.put(microBlock);
        });
    }

    /**
     * Checks if a micro block exists for the given flow ID and nonce.
     *
     * @param {string} flowId - The unique identifier for the flow.
     * @param {number} nonce - The unique number representing the sequence within the flow.
     * @return {Promise<boolean>} A promise that resolves to a boolean indicating the existence of the micro block.
     * @throws {IllegalStateError} If there are multiple micro blocks with the same flow ID and nonce.
     */
    async checkMicroBlockExists(flowId: string, nonce: number): Promise<boolean> {
        const count = await this.db.microBlocks.where('[flowId+nonce]').equals([flowId, nonce]).count();
        if (count > 1) throw new IllegalStateError('Two or more micro blocks share the same flow/nonce!');
        return count > 0;
    }

    /**
     * Updates the master block associated with a given micro block.
     *
     * @param {string} microBlockId - The unique identifier of the micro block to update.
     * @param {number} masterBlockId - The ID of the master block to link with the micro block.
     * @return {Promise<void>} Resolves when the update operation is completed successfully.
     */
    async updateMasterMicroBlock(microBlockId: string, masterBlockId: number): Promise<void> {
        await this.db.microBlocks.update(microBlockId, { masterBlock: masterBlockId });
    }
}
