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
import {Account, Application, ApplicationVirtualBlockchain, Flow, MicroBlock} from '@/entrypoints/main/Account.tsx';
import { VirtualBlockchainView } from '@/entrypoints/main/virtual-blockchain-view.tsx';
import { RecordConfirmationData } from '@/entrypoints/components/popup/popup-dashboard.tsx';
import Guard from '@/entrypoints/main/Guard.tsx';
import { IllegalStateError } from '@/entrypoints/main/errors.tsx';


export class AccountStorageDB extends Dexie {

    applicationsVirtualBlockchains!: Table<ApplicationVirtualBlockchain, string>;

    constructor(dbName: string) {
        super(dbName);
        this.version(1).stores({
            applicationsVirtualBlockchains: 'virtualBlockchainId',
        });
    }

    static async connectDatabase(account: Account): Promise<AccountStorageDB> {
        const dbName = `account-${account.id}`;
        return new AccountStorageDB(dbName);
    }


}

/**
 * Manages data storage for blockchain-related entities such as applications, flows, and micro-blocks.
 * Provides methods to interact with an IndexedDB database, allowing for storage, retrieval, and update operations.
 */
export class AccountDataStorage {


    private constructor(private db: AccountStorageDB, private account: Account) {}

    /**
     * Connects to the database for the specified account and initializes a DataStorage instance.
     *
     * @param {Account} account - The account object containing the details required to connect to the database.
     * @return {Promise<AccountDataStorage>} A promise that resolves to the initialized DataStorage instance.
     */
    static async connectDatabase(account: Account): Promise<AccountDataStorage> {
        const dbName = `account-${account.id}`;
        const db = new AccountStorageDB(dbName);
        return new AccountDataStorage(db, account);
    }

    /**
     * Retrieves a list of application virtual blockchain IDs with pagination.
     *
     * @param {number} offset - The starting position of the records to retrieve.
     * @param {number} limit - The maximum number of records to retrieve.
     * @return {Promise<Array>} A promise that resolves to an array of application virtual blockchain IDs.
     */
    async getAllApplicationVirtualBlockchainId(offset: number, limit: number, ) {
        return this.db.applicationsVirtualBlockchains.limit(limit).offset(offset).toArray()
    }

    /**
     * Retrieves the total count of application virtual blockchain identifiers from the database.
     *
     * @return {Promise<number>} A promise that resolves to the number of application virtual blockchain IDs.
     */
    async getNumberOfApplicationVirtualBlockchainId() {
        return this.db.applicationsVirtualBlockchains.count()
    }


    /**
     * Stores the provided virtual blockchain ID in the database.
     *
     * @param {string} virtualBlockchainId - The unique identifier for the virtual blockchain to be stored.
     * @return {Promise<void>} A promise that resolves when the virtual blockchain ID has been successfully stored.
     */
    async storeApplicationVirtualBlockchainId(virtualBlockchainId: string) {
        await this.db.transaction('rw', [this.db.applicationsVirtualBlockchains], async () => {
            await this.db.applicationsVirtualBlockchains.put({
                virtualBlockchainId
            })
        });
    }

    /*
    async getAllBlocksByFlowId(flowId: string): Promise<MicroBlock[]> {
        return this.db.microBlocks.where('flowId').equals(flowId).toArray();
    }
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

    async checkMicroBlockExists(flowId: string, nonce: number): Promise<boolean> {
        const count = await this.db.microBlocks.where('[flowId+nonce]').equals([flowId, nonce]).count();
        if (count > 1) throw new IllegalStateError('Two or more micro blocks share the same flow/nonce!');
        return count > 0;
    }

    async updateMasterMicroBlock(microBlockId: string, masterBlockId: number): Promise<void> {
        await this.db.microBlocks.update(microBlockId, { masterBlock: masterBlockId });
    }

     */
}
