import {atom, useRecoilState} from "recoil";

export const dataViewEnabledState = atom<boolean>({ key: 'seeDataView', default: false })
//export const vbState = atom<sdk.blockchain.appUserVb|undefined>({ key: 'eventApprovalVB', default: undefined })
export const heightState = atom<number|undefined>({ key: 'heightState', default: undefined })
export const pathState = atom<string[]>({ key: 'pathVB', default: [] })
export const errorState = atom<string[]>({ key: 'errorState', default: undefined })