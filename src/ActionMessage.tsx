export interface ActionMessage {
    id: string,
    action: string,
    data: any,
    receivedAt: number,
    origin: string
}

export interface ActionRequest {
    action: string,
    data: any,
    origin: string,
}
