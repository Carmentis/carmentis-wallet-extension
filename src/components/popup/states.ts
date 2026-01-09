import {atom, } from "recoil";

export const dataViewEnabledState = atom<boolean>({ key: 'seeDataView', default: true })
export const heightState = atom<number|undefined>({ key: 'heightState', default: undefined })
export const pathState = atom<string[]>({ key: 'pathVB', default: [] })
export const errorState = atom<string[]>({ key: 'errorState', default: undefined })