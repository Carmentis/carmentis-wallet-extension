import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, UserCircleIcon, WalletIcon, CogIcon } from '@heroicons/react/24/outline';

function BottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md px-4 py-2 flex justify-around items-center">
            <button className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                <ClockIcon className="h-6 w-6" />
            </button>
            <button className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                <UserCircleIcon className="h-6 w-6" />
            </button>
            <button  className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                <WalletIcon className="h-6 w-6" />
            </button>
            <button className="flex flex-col items-center text-gray-700 hover:text-gray-900">
                <CogIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default BottomNav;
