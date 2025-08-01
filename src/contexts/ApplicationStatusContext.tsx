import {createContext, PropsWithChildren, useState} from 'react';

export interface ApplicationInitialisationStatus {
	applicationInitialised: boolean,
	accountCreated: boolean,
	setApplicationInitialised: () => void,
	setAccountCreated: () => void,
	setApplicationNotInitialised: () => void,
	setAccountNotCreated: () => void,
}
export const ApplicationStatusContext = createContext<ApplicationInitialisationStatus|undefined>(undefined);

export function ApplicationStatusContextProvider({children}: PropsWithChildren) {
	const [applicationInitialised, setApplicationInitialised] = useState(true);
	const [accountCreated, setAccountCreated] = useState(false);

	const state = {
		applicationInitialised,
		accountCreated,
		setApplicationInitialised: () => setApplicationInitialised(true),
		setAccountCreated: () => setAccountCreated(true),
		setApplicationNotInitialised: () => setApplicationInitialised(false),
		setAccountNotCreated: () => setAccountCreated(false),
	}

	return <ApplicationStatusContext.Provider value={state}>
		{children}
	</ApplicationStatusContext.Provider>
}

