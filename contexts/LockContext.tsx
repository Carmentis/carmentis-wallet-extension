import {createContext} from 'react';

export const LockContext = createContext({
    isLocked: true,
    setIsLocked: (isLocked: boolean) => {}
});

