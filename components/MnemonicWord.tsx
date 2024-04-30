import React, {ChangeEventHandler} from 'react';

interface MnemonicWordProps {
    label: string;
}

const MnemonicWord: React.FC<MnemonicWordProps> = ({label}) => {
    return (
        <span className={"p-1"}>
            {label}
        </span>
    );
}

export default MnemonicWord;
