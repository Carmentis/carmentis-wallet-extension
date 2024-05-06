import React, {ChangeEventHandler} from 'react';

interface InputProps {
    type?: 'password' | 'text' | 'email' | 'number' | 'checkbox' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'image' | 'hidden' | 'reset' | 'submit' | 'button' | undefined;
    label: string;
    id: string;
    name: string;
    autoComplete: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({type, label, id, name, autoComplete, onChange, value='', autoFocus = false}) => {
    return (
        <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={name}
                    type={type ? type : 'text'}
                    autoComplete={autoComplete}
                    required
                    autoFocus={autoFocus}
                    onChange={onChange}
                    className="focus:border-blue border-black border-solid block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            </div>
        </div>
    );
}

export default Input;
