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

import {AccountStorageDB} from "@/utils/db/AccountStorageDB.ts";
import {Account} from "@/types/Account.ts";

/**
 * Manages data storage for blockchain-related entities such as applications, flows, and micro-blocks.
 * Provides methods to interact with an IndexedDB database, allowing for storage, retrieval, and update operations.
 */
export class AccountDataStorage {


    private constructor(private db: AccountStorageDB, private account: Account) {
    }

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
    async getAllApplicationVirtualBlockchainId(offset: number, limit: number,) {
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
}