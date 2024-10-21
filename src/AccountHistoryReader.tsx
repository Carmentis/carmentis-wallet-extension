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

import {Account, Application, MicroBlock} from "@/src/Account.tsx";
import {Block} from "@babel/types";

export class AccountHistoryReader {

    constructor(private readonly applicationByApplicationId: { [key: string]: Application  }) {}


    /**
     * Returns the number of applications in which the user is engaged.
     */
    getNumberOfApplications() : number {
        return Object.entries(this.applicationByApplicationId).length;
    }

    /**
     * Returns the number of flows in which the user is involved.
     *
     * @returns Number of flows.
     */
    getNumberOfFlows() {
        return Object.values(this.applicationByApplicationId)
            .map(  microBlocks => Object.entries(microBlocks.microBlocksByFlowId).length )
            .reduce((acc, x) => acc + x, 0);
    }


    /**
     * Returns all the flows.
     */
    getAllFlows() : FlowView[] {
        const res : FlowView[] = [];
        Object.entries(this.applicationByApplicationId)
            .forEach(([applicationId, application]) => {
                Object.entries(application.microBlocksByFlowId)
                    .forEach(([flowId, microChain]) => {
                        const lastUpdate = microChain.map(block => block.ts)
                            .reduce((acc, ts) => acc < ts ? ts : acc)

                        const flowView : FlowView = {
                            applicationId: applicationId,
                            lastUpdate: lastUpdate,
                            flowId: flowId,
                            applicationName: application.applicationName,
                            flowLength: microChain.length,
                            applicationDomain: application.rootDomain
                        };
                        res.push(flowView);
                    });
            });
        return res;
    }


    /**
     * Returns the spent gas.
     *
     * Gas spent for blocks initiated by **other** users are not counted.
     *
     * @returns number
     */
    getSpentGaz() : number {
        return Object.values(this.applicationByApplicationId)
            .map( application => {
                return Object.values(application.microBlocksByFlowId)
                    .map((microBlocks) => {
                        return microBlocks.map( block => block.isInitiator ? block.gas : 0 )
                            .reduce((acc, x) => acc + x, 0);
                    }).reduce((acc, x) => acc + x, 0);
            }).reduce((acc, x) => acc + x, 0);
    }

    getAllBlocksByFlowId(applicationId: string, flowId: string) : MicroBlock[] {
        return this.applicationByApplicationId[applicationId].microBlocksByFlowId[flowId];
    }
}


export interface FlowView {
    lastUpdate: number;
    flowId: string;
    applicationId: string;
    applicationName: string;
    flowLength: number
    applicationDomain: string;
}