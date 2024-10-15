export interface ActionMessage {
    id: string,
    action: string,
    data: any,
    receivedAt: number,
    origin: string,
    type : "unknown" | "signIn" | "authentication" | "eventApproval"

    eventApprovalData?: object
    serverRequest?: object,
    clientRequest?: object,

}

export interface ActionRequest {
    action: string,
    data: any,
    origin: string,
}
