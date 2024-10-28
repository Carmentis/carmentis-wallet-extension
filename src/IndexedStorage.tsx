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

import {Account, MicroBlock, Application, Flow} from "@/src/Account.tsx";
import {RecordConfirmationData} from "@/src/components/popup/PopupDashboard.tsx";
import Guard from "@/src/Guard.tsx";
import {IllegalStateError} from "@/src/errors.tsx";
import {Optional} from "@/src/Optional.tsx";
import {FlowView} from "@/src/FlowView.tsx";

export class IndexedStorage {


    static CreateDatabase(account : Account) : Promise<IndexedStorage> {
        const dbName = "account-" + account.getId();
        return new Promise((resolve, reject) => {

            var open = indexedDB.open(dbName , 1);

            // Create the schema
            open.onupgradeneeded = function() {
                var db = open.result;

                // create the application table
                db.createObjectStore("Application", {keyPath: ["applicationId"]});

                // create the flow table
                var store = db.createObjectStore("Flow", {keyPath: ["flowId"]});
                store.createIndex("by_application", ["applicationId"]);

                // create the micro block table
                store = db.createObjectStore("MicroBlock", {keyPath: ["microBlockId"]});
                store.createIndex("by_flow", ["flowId"]); // to access all blocks in a flow
                store.createIndex("by_flow_nonce", ["flowId", "nonce"]); // to access a micro-block in flow at position

            };

            open.onsuccess = function() {
                console.log("[index] database accessed")
                resolve(new IndexedStorage(open.result, account))
            }
        });
    }

    constructor(private db : IDBDatabase, private account : Account) {
    }


    private getApplicationStore(  mode : "readonly" | "readwrite" ) : IDBObjectStore {
        const transaction = this.db.transaction("Application", mode);
        return transaction.objectStore('Application');
    }

    private getFlowStore( mode : "readonly" | "readwrite" ) : IDBObjectStore {
        const transaction = this.db.transaction("Flow", mode);
        return transaction.objectStore('Flow');
    }

    private getMicroBlockStore( mode : "readonly" | "readwrite" ) : IDBObjectStore {
        const transaction = this.db.transaction("MicroBlock", mode);
        return transaction.objectStore('MicroBlock');
    }



    /**
     * Returns the number of applications in which the user is engaged.
     */
    getNumberOfApplications() : Promise<number> {
        return new Promise((resolve, reject) => {
            const store = this.getApplicationStore("readonly");
            const request = store.count()
            request.onsuccess = () => {
                resolve(request.result);  // The result is the count of objects
            };

            request.onerror = (event) => {
                reject(`Error counting data: ${(event.target as IDBRequest).error}`);
            };
            })

    }

    /**
     * Returns the number of flows in which the user is involved.
     *
     * @returns Number of flows.
     */
    getFlowsNumberOfAccount() : Promise<number> {
        return new Promise((resolve, reject) => {
            const store = this.getFlowStore("readonly");
            const request = store.count();
            request.onsuccess = () => {
                resolve(request.result);  // The result is the count of objects
            };

            request.onerror = (event) => {
                reject(`Error counting data: ${(event.target as IDBRequest).error}`);
            };
        })

    }


    getFlowLength(flowId : string) : Promise<number> {
        return new Promise((resolve, reject) => {

            const store = this.getMicroBlockStore("readonly");
            const index = store.index('by_flow');
            const request = index.count([flowId]);

            request.onsuccess = () => {
                resolve(request.result);  // The result is the count of objects
            };

            request.onerror = (event) => {
                reject(`Error counting data: ${(event.target as IDBRequest).error}`);
            };

        })
    }


    getApplicationByApplicationId( applicationId : string ) : Promise<Application> {
        return new Promise((resolve, reject) => {
            const store = this.getApplicationStore("readonly");
            const request = store.get([applicationId]);
            request.onsuccess = () => { resolve(request.result); };
            request.onerror = (event) => { reject() }
        })
    }

    /**
     * Returns all the flows.
     */
    getAllFlowsOfAccount() : Promise<FlowView[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const store = this.getFlowStore("readonly");
                const request = store.getAll();


                request.onsuccess = async () => {

                    const flows: Flow[] = request.result;
                    const flowViews : FlowView[] = []
                    for (const flow of flows) {

                        const application : Application = await this.getApplicationByApplicationId(flow.applicationId);
                        const newestBlock : MicroBlock =  await this.getNewestBlockInFlow(flow.flowId);
                        const flowView: FlowView = {
                            applicationDomain: application.rootDomain,
                            applicationId: application.applicationId,
                            applicationName: application.applicationName,
                            flowId: flow.flowId,
                            flowLength: await this.getFlowLength(flow.flowId),
                            lastUpdate: newestBlock.ts,
                        }
                        flowViews.push(flowView);

                    }
                    resolve(flowViews);

                }

                request.onerror = () => { reject() }

            } catch (error) {
                reject(error);
            }
        })
    }

    getNewestBlockInFlow(flowId : string) : Promise<MicroBlock> {
        return new Promise((resolve, reject) => {

            const store = this.getMicroBlockStore("readonly");
            const index = store.index('by_flow');
            const request = index.getAll([ flowId ]);

            request.onsuccess = async () => {

                const blocks : MicroBlock[] = request.result;
                let newestBlock = blocks[0];
                for (const block of blocks) {
                    if ( newestBlock.ts < block.ts ) {
                        newestBlock = block;
                    }
                }
                resolve(newestBlock);

            }

            request.onerror = () => { reject() }

        });
    }


    /**
     * Returns the spent gas.
     *
     * Gas spent for blocks initiated by **other** users are not counted.
     *
     * @returns number
     */
    getSpentGaz() : Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {

                const store = this.getMicroBlockStore("readonly");
                const request = store.getAll();
                //const request = index.getAll([this.account.getId()]);
                let spentGas = 0;

                request.onsuccess = function () {

                    const blocks : MicroBlock[] = request.result;
                    for (const block of blocks) {
                        spentGas += block.gas
                    }
                    resolve(spentGas);

                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getAllBlocksByFlowId(flowId: string) : Promise<MicroBlock[]> {
        return new Promise((resolve, reject) => {

            const store = this.getMicroBlockStore("readonly");
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

    addApprovedBlockInActiveAccountHistory(record: RecordConfirmationData) : Promise<[void, void, void]> {
        const application : Application = {
            rootDomain: Guard.PreventUndefined(record.rootDomain),
            accountId: this.account.getId(),
            applicationId: Guard.PreventUndefined(record.applicationId),
            applicationName: Guard.PreventUndefined(record.applicationName)
        }

        const flow : Flow = {
            accountId: this.account.getId(),
            applicationId: Guard.PreventUndefined(record.applicationId),
            flowId: Guard.PreventUndefined(record.flowId)
        }

        const microBlock : MicroBlock = {
            accountId: this.account.getId(),
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
        }

        console.log("[index] addition of approved block:", application, flow, microBlock)

        return Promise.all([
            this.addMicroBlock(microBlock),
            this.addFlow(flow),
            this.addApplication(application),
        ])
    }

    addMicroBlock( microBlock : MicroBlock ) : Promise<void> {
        return this.addInStore(this.getMicroBlockStore("readwrite"), microBlock);
    }

    private addFlow( flow : Flow ) : Promise<void> {
        return this.addInStore(this.getFlowStore("readwrite"), flow);
    }


    private addApplication( application : Application ) : Promise<void> {
        return this.addInStore(this.getApplicationStore("readwrite"), application);
    }

    private addInStore<T>(store : IDBObjectStore, item : T) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const request = store.put(item);
                request.onsuccess = function () {
                    resolve()
                }

                request.onerror = function (error) {
                    reject(error);
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    checkMicroBlockExists(flowId: string, nonce: number) {
        return new Promise(async (resolve, reject) => {

            const store = this.getMicroBlockStore("readonly");
            const index = store.index('by_flow_nonce');
            const request = index.count([ flowId, nonce ]);

            request.onsuccess = () => {
                const matchesNumber = request.result;
                if ( matchesNumber > 1 ) {
                    throw new IllegalStateError("Two or more micro blocks are sharing the same flow/nonce!")
                }
                resolve(request.result !== 0);  // The result is the count of objects
            };

            request.onerror = (event) => {
                reject(`Error counting data: ${(event.target as IDBRequest).error}`);
            };

        })
    }

    getMicroBlockByMicroBlockId( microBlockId : string ) : Promise<Optional<MicroBlock>> {
        return new Promise(async (resolve, reject) => {

            const store = this.getMicroBlockStore("readonly");
            const request = store.get([microBlockId])

            request.onsuccess = () => {
                const block = request.result;
                if ( block ) {
                    resolve(Optional.From(block))
                } else {
                    resolve(Optional.Empty());
                }
            };

            request.onerror = (event) => {
                console.warn(`Error accessing block: ${(event.target as IDBRequest).error}`);
                resolve(Optional.Empty());
            };

        })
    }

    updateMasterMicroBlock(microBlockId : string, masterBlockId : number ) : Promise<void> {
        return new Promise(async (resolve, reject) => {

            const blockOption : Optional<MicroBlock> = await this.getMicroBlockByMicroBlockId(microBlockId);
            if ( blockOption.isSome() ) {

                // update the block
                const block = blockOption.unwrap();
                console.log(`[index] set master block at ${masterBlockId} of micro block ${microBlockId}  :`, block)
                block.masterBlock = masterBlockId
                const store = this.getMicroBlockStore("readwrite");
                const request = store.put(block);

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    reject(`Error counting data: ${(event.target as IDBRequest).error}`);
                };
            } else {
                throw new IllegalStateError(`The micro block does not exist: micro id at ${microBlockId}`)
            }

        })
    }
}
