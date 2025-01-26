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


import {Account, Application, Flow, MicroBlock} from '@/entrypoints/main/Account.tsx';
import {VirtualBlockchainView} from '@/entrypoints/main/virtual-blockchain-view.tsx';
import {RecordConfirmationData} from '@/entrypoints/components/popup/PopupDashboard.tsx';
import Guard from '@/entrypoints/main/Guard.tsx';
import {IllegalStateError} from '@/entrypoints/main/errors.tsx';
import {Optional} from '@/entrypoints/main/Optional.tsx';

/**
 * Interface to query the indexed database.
 */
export class IndexedStorage {


	/**
	 * Connects to the database.
	 *
	 * The database in which the interface connects is specialized for the provided account.
	 * In other words, all accessed objects are implicitly associated with the provided account.
	 *
	 * Example:
	 * ```ts
	 * const account : Account = ...;
	 * IndexedStorage.ConnectDatabase(account).then(db => {
	 *      // Do query here
	 * });
	 * ```
	 *
	 * @param account The account for which the accessed data is associated with.
	 *
	 * @constructor
	 */
	static ConnectDatabase(account: Account): Promise<IndexedStorage> {
		const dbName = 'account-' + account.id;
		return new Promise((resolve, reject) => {

			var open = indexedDB.open(dbName, 1);

			// Create the schema
			open.onupgradeneeded = function() {
				var db = open.result;

				// create the application table
				db.createObjectStore('Application', { keyPath: ['applicationId'] });

				// create the flow table
				var store = db.createObjectStore('Flow', { keyPath: ['flowId'] });
				store.createIndex('by_application', ['applicationId']);

				// create the micro block table
				store = db.createObjectStore('MicroBlock', { keyPath: ['microBlockId'] });
				store.createIndex('by_flow', ['flowId']); // to access all blocks in a flow
				store.createIndex('by_flow_nonce', ['flowId', 'nonce']); // to access a micro-block in flow at position

			};

			open.onsuccess = function() {
				console.log('[index] database accessed');
				resolve(new IndexedStorage(open.result, account));
			};
		});
	}

	/**
	 * Constructor for the {@link IndexedStorage} object.
	 *
	 * This constructor is private and should not be used externally.
	 *
	 * @param db The database.
	 * @param account The account.
	 * @private
	 */
	private constructor(private db: IDBDatabase, private account: Account) {
	}


	/**
	 * Returns the number of applications in which the user is engaged.
	 */
	getNumberOfApplications(): Promise<number> {
		return new Promise((resolve, reject) => {
			const store = this.getApplicationStore('readonly');
			const request = store.count();
			request.onsuccess = () => {
				resolve(request.result);  // The result is the count of objects
			};

			request.onerror = (event) => {
				reject(`Error counting data: ${(event.target as IDBRequest).error}`);
			};
		});

	}

	/**
	 * Returns the number of flows in which the user is involved.
	 *
	 * @returns Number of flows.
	 */
	getFlowsNumberOfAccount(): Promise<number> {
		return new Promise((resolve, reject) => {
			const store = this.getFlowStore('readonly');
			const request = store.count();
			request.onsuccess = () => {
				resolve(request.result);  // The result is the count of objects
			};

			request.onerror = (event) => {
				reject(`Error counting data: ${(event.target as IDBRequest).error}`);
			};
		});

	}


	/**
	 * Returns the length of the specified flow.
	 *
	 * @param flowId The identifier of the flow.
	 */
	getFlowLength(flowId: string): Promise<number> {
		return new Promise((resolve, reject) => {

			const store = this.getMicroBlockStore('readonly');
			const index = store.index('by_flow');
			const request = index.count([flowId]);

			request.onsuccess = () => {
				resolve(request.result);  // The result is the count of objects
			};

			request.onerror = (event) => {
				reject(`Error counting data: ${(event.target as IDBRequest).error}`);
			};

		});
	}


	/**
	 * Returns the application having the provided identifier.
	 *
	 * @param applicationId The identifier of the application.
	 */
	getApplicationByApplicationId(applicationId: string): Promise<Application> {
		return new Promise((resolve, reject) => {
			const store = this.getApplicationStore('readonly');
			const request = store.get([applicationId]);
			request.onsuccess = () => {
				resolve(request.result);
			};
			request.onerror = (event) => {
				reject();
			};
		});
	}

	/**
	 * Returns all the flows.
	 */
	getAllFlowsOfAccount(): Promise<VirtualBlockchainView[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const store = this.getFlowStore('readonly');
				const request = store.getAll();


				request.onsuccess = async () => {

					const flows: Flow[] = request.result;
					const flowViews: VirtualBlockchainView[] = [];
					for (const flow of flows) {

						const application: Application = await this.getApplicationByApplicationId(flow.applicationId);
						const newestBlock: MicroBlock = await this.getNewestBlockInFlow(flow.flowId);
						const flowView: VirtualBlockchainView = {
							applicationDomain: application.rootDomain,
							applicationId: application.applicationId,
							applicationName: application.applicationName,
							virtualBlockchainId: flow.flowId,
							flowLength: await this.getFlowLength(flow.flowId),
							lastUpdate: newestBlock.ts,
						};
						flowViews.push(flowView);

					}
					resolve(flowViews);

				};

				request.onerror = () => {
					reject();
				};

			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Returns the newest block in the flow having the provided flow identifier.
	 *
	 * @param flowId The identifier of the flow.
	 */
	getNewestBlockInFlow(flowId: string): Promise<MicroBlock> {
		return new Promise((resolve, reject) => {

			const store = this.getMicroBlockStore('readonly');
			const index = store.index('by_flow');
			const request = index.getAll([flowId]);

			request.onsuccess = async () => {

				const blocks: MicroBlock[] = request.result;
				let newestBlock = blocks[0];
				for (const block of blocks) {
					if (newestBlock.ts < block.ts) {
						newestBlock = block;
					}
				}
				resolve(newestBlock);

			};

			request.onerror = () => {
				reject();
			};

		});
	}


	/**
	 * Returns the spent gas.
	 *
	 * Gas spent for blocks initiated by **other** users are not counted.
	 *
	 * @returns number
	 */
	getSpentGaz(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {

				const store = this.getMicroBlockStore('readonly');
				const request = store.getAll();
				//const request = index.getAll([this.account.getId()]);
				let spentGas = 0;

				request.onsuccess = function() {

					const blocks: MicroBlock[] = request.result;
					for (const block of blocks) {
						spentGas += block.gas;
					}
					resolve(spentGas);

				};
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Returns all blocks in the flow having the provided flow identifier.
	 *
	 * @param flowId The identifier of the flow.
	 */
	getAllBlocksByFlowId(flowId: string): Promise<MicroBlock[]> {
		return new Promise((resolve, reject) => {

			const store = this.getMicroBlockStore('readonly');
			const index = store.index('by_flow');
			const request = index.getAll([flowId]);

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = (event) => {
				reject(`Error while accessing flows: ${(event.target as IDBRequest).error}`);
			};

		});
	}

	/**
	 * Adds an approved block in the database.
	 *
	 * @param record The approved block.
	 */
	addApprovedBlockInActiveAccountHistory(record: RecordConfirmationData): Promise<[void, void, void]> {
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

		console.log('[index] addition of approved block:', application, flow, microBlock);

		return Promise.all([
			this.addMicroBlock(microBlock),
			this.addFlow(flow),
			this.addApplication(application),
		]);
	}

	/**
	 * Adds a micro block in the database.
	 *
	 * @param microBlock The micro block to add in database.
	 */
	addMicroBlock(microBlock: MicroBlock): Promise<void> {
		return this.addInStore(this.getMicroBlockStore('readwrite'), microBlock);
	}


	/**
	 * Checks if the {@link nonce}-th micro block exists in the flow having the provided identifier.
	 *
	 * @param flowId The identifier of the flow.
	 * @param nonce The position of the micro-block in the flow. (should be greater or equals than one).
	 */
	checkMicroBlockExists(flowId: string, nonce: number) {
		if (nonce < 1) {
			throw new Error(`The provided nonce is invalid: Got ${nonce} which is strictly lower than 1`);
		}

		return new Promise(async (resolve, reject) => {

			const store = this.getMicroBlockStore('readonly');
			const index = store.index('by_flow_nonce');
			const request = index.count([flowId, nonce]);

			request.onsuccess = () => {
				const matchesNumber = request.result;
				if (matchesNumber > 1) {
					throw new IllegalStateError('Two or more micro blocks are sharing the same flow/nonce!');
				}
				resolve(request.result !== 0);  // The result is the count of objects
			};

			request.onerror = (event) => {
				reject(`Error counting data: ${(event.target as IDBRequest).error}`);
			};

		});
	}

	/**
	 * Returns the micro block having the provided identifier.
	 *
	 * @param microBlockId The micro block.
	 */
	getMicroBlockByMicroBlockId(microBlockId: string): Promise<Optional<MicroBlock>> {
		return new Promise(async (resolve, reject) => {

			const store = this.getMicroBlockStore('readonly');
			const request = store.get([microBlockId]);

			request.onsuccess = () => {
				const block = request.result;
				if (block) {
					resolve(Optional.From(block));
				} else {
					resolve(Optional.Empty());
				}
			};

			request.onerror = (event) => {
				console.warn(`Error accessing block: ${(event.target as IDBRequest).error}`);
				resolve(Optional.Empty());
			};

		});
	}

	/**
	 * Updates the master block location of an already existing micro block in the database.
	 *
	 * @param microBlockId The identifier of the micro block.
	 * @param masterBlockId The identifier of the master block.
	 *
	 * @throws IllegalStateError If the micro block does not exist.
	 */
	updateMasterMicroBlock(microBlockId: string, masterBlockId: number): Promise<void> {
		return new Promise(async (resolve, reject) => {

			const blockOption: Optional<MicroBlock> = await this.getMicroBlockByMicroBlockId(microBlockId);
			if (blockOption.isSome()) {

				// update the block
				const block = blockOption.unwrap();
				console.log(`[index] set master block at ${masterBlockId} of micro block ${microBlockId}  :`, block);
				block.masterBlock = masterBlockId;
				const store = this.getMicroBlockStore('readwrite');
				const request = store.put(block);

				request.onsuccess = () => {
					resolve();
				};

				request.onerror = (event) => {
					reject(`Error counting data: ${(event.target as IDBRequest).error}`);
				};
			} else {
				throw new IllegalStateError(`The micro block does not exist: micro id at ${microBlockId}`);
			}

		});
	}


	/**
	 * Returns the application store.
	 *
	 * @param mode The access mode.
	 * @private
	 */
	private getApplicationStore(mode: 'readonly' | 'readwrite'): IDBObjectStore {
		const transaction = this.db.transaction('Application', mode);
		return transaction.objectStore('Application');
	}


	/**
	 * Returns the flow store.
	 *
	 * @param mode The access mode.
	 * @private
	 */
	private getFlowStore(mode: 'readonly' | 'readwrite'): IDBObjectStore {
		const transaction = this.db.transaction('Flow', mode);
		return transaction.objectStore('Flow');
	}

	/**
	 * Returns the micro block store.
	 *
	 * @param mode The access mode.
	 * @private
	 */
	private getMicroBlockStore(mode: 'readonly' | 'readwrite'): IDBObjectStore {
		const transaction = this.db.transaction('MicroBlock', mode);
		return transaction.objectStore('MicroBlock');
	}


	/**
	 * Add a flow in the database.
	 *
	 * @param flow The flow to add in database.
	 *
	 * @private
	 */
	private addFlow(flow: Flow): Promise<void> {
		return this.addInStore(this.getFlowStore('readwrite'), flow);
	}


	/**
	 * Add an application in the database.
	 *
	 * @param application The application to add in database.
	 * @private
	 */
	private addApplication(application: Application): Promise<void> {
		return this.addInStore(this.getApplicationStore('readwrite'), application);
	}

	/**
	 * Adds an object in the provided store.
	 *
	 * @param store The store in which the object is stored.
	 * @param item The item to add in the provided store.
	 *
	 * @private
	 */
	private addInStore<T>(store: IDBObjectStore, item: T): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				const request = store.put(item);
				request.onsuccess = function() {
					resolve();
				};

				request.onerror = function(error) {
					reject(error);
				};
			} catch (e) {
				reject(e);
			}
		});
	}


}
