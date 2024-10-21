import {Optional} from "@/src/Optional.tsx";
import {randomHex} from "@/src/Random.tsx";
import {RecordConfirmationData} from "@/src/components/popup/PopupDashboard.tsx";
import Guard from "@/src/Guard.tsx";
import {AccountHistoryReader} from "@/src/AccountHistoryReader.tsx";
import {AccountHistoryWriter} from "@/src/providers/AccountHistoryWriter.tsx";

const DEFAULT_ACCOUNT_NAME = "Account"
const DEFAULT_NONCE = 0;

/**
 * Represents the data structure consisting of the email validation proof.
 */
export interface EmailValidationProofData {
    ts: number,
    email: string,
    publicKey: string,
    signature: string,
}

/**
 * Structure representing the application.
 */
export interface Application {
    applicationName: string,
    rootDomain: string,
    microBlocksByFlowId: { [key: string]: MicroBlock[] };
}

/**
 * Represent a block in a micro-chain.
 *
 */
export interface MicroBlock {
    microBlockId: string,
    nonce: number,
    ts: number,
    gas: number,
    gasPrice: number,
    data: object | undefined,
    version: number

    /**
     * The master block defines the master block containing the micro block.
     *
     * When the master block is missing, it means that either the master block containing this micro block is
     * not anchored yet, or is anchored by the synchronisation has not been done.
     */
    masterBlock: number | undefined,

    /**
     * This field is set at true when the user is the initiator of this block.
     */
    isInitiator: boolean,
}

/**
 * The AccountData interface is used to include a
 */
export interface AccountData {
    id : string,
    nonce : number,
    pseudo: string;
    email: string | undefined;
    emailValidationProof: EmailValidationProofData | undefined
    applicationByApplicationId: { [key: string]: Application  }
}



export class Account {

    data : AccountData

    constructor(data : AccountData) {
        this.data = data;
    }

    getPseudo() : string {
        return this.data.pseudo;
    }

    getEmail() : Optional<string> {
        if (this.data.email == undefined) {
            return Optional.Empty();
        }
        return Optional.From(this.data.email);
    }

    hasVerifiedEmail(): boolean {
        return this.data.emailValidationProof !== undefined;
    }


    /**
     * This function creates a default account.
     *
     * @constructor
     *
     * @return Account The created account.
     */
    static Default() : Account {
        return new Account({
            id: this.GenerateAccountId(),
            pseudo: DEFAULT_ACCOUNT_NAME,
            email: undefined,
            emailValidationProof: undefined,
            nonce: DEFAULT_NONCE,
            applicationByApplicationId: {}
        })
    }

    static CreateFromDict(account : AccountData) : Account {
        return new Account(account);
    }

    /**
     * Returns the email verification proof.
     *
     * @throws Error If the email is not verified.
     */
    getEmailValidationProofData() : EmailValidationProofData {
        if ( this.data.emailValidationProof === undefined ) {
            throw new Error( "The active account do not have verified its email" );
        }
        return this.data.emailValidationProof
    }

    /**
     * Returns the identifier of the account.
     */
    getId() : string {
        return this.data.id;
    }


    /**
     * Creates an account from a given pseudo.
     *
     * The created account contains the strictly minimal information to create a valid account.
     *
     * @param accountPseudo The pseudo of the created account.
     * @param nonce The nonce associated with the account
     *
     * @constructor
     */
    static CreateFromPseudoAndNonce(accountPseudo: string, nonce : number) : Account {
        return new Account({
            email: undefined,
            emailValidationProof: undefined,
            id: this.GenerateAccountId(),
            nonce: nonce,
            pseudo: accountPseudo,
            applicationByApplicationId: {},
        });
    }

    /**
     * Returns a freshly generated identifier.
     *
     * @return string The generated identifier.
     */
    private static GenerateAccountId() : string {
        return randomHex(32)
    }

    /**
     * Returns the nonce associated with the account.
     */
    getNonce() {
        return this.data.nonce
    }


    getHistoryReader() : AccountHistoryReader {
        return new AccountHistoryReader(
            this.data.applicationByApplicationId
        )
    }

    getHistoryWriter() : AccountHistoryWriter {
        return new AccountHistoryWriter(
            this.data.applicationByApplicationId
        )
    }

    addApprovedBlock(record: RecordConfirmationData) {
        const flowId : string = Guard.PreventUndefined(record.flowId);
        const block : MicroBlock = {
            isInitiator: true,
            data: Guard.PreventUndefined(record.data),
            gas: Guard.PreventUndefined(record.gas),
            gasPrice: Guard.PreventUndefined(record.gasPrice),
            microBlockId: Guard.PreventUndefined(record.microBlockId),
            nonce: Guard.PreventUndefined(record.nonce),
            ts: Guard.PreventUndefined(record.ts),
            version: Guard.PreventUndefined(record.applicationVersion),
            masterBlock: undefined
        }

        // if the application exists, contains a micro-chain having the provided flowId then add the block to it
        // or create the application and initiate it with the microChain
        const applicationId : string = Guard.PreventUndefined(record.applicationId);
        if (this.data.applicationByApplicationId[applicationId]) {
            // insert the block in the micro-chain or insert it in the applicationId
            // or create the microChain in the application with the provided flowId
            const application = this.data.applicationByApplicationId[applicationId];
            if ( application.microBlocksByFlowId[flowId] ) {
                const microChain = application.microBlocksByFlowId[flowId];
                microChain.push(block)
            } else {
                application.microBlocksByFlowId[flowId] = [block]
            }
        } else {
            const microChainByFlowId: { [key: string]: MicroBlock[] } = {}
            microChainByFlowId[flowId] = [block];
            this.data.applicationByApplicationId[applicationId] = {
                applicationName: Guard.PreventUndefined(record.applicationName),
                rootDomain: Guard.PreventUndefined(record.rootDomain),
                microBlocksByFlowId: microChainByFlowId
            }
        }
    }
}