import { goBack } from 'react-chrome-extension-router';

export default function Header({ canGoBack = false, title = "Carmentis" }) {
    return (
        <header className="fixed top-0 w-full bg-white shadow px-4 py-3 md:px-6 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    {canGoBack && (
                        <button onClick={goBack} aria-label="Go back" className="mr-4">
                            &lt;  {/* Consider replacing with an SVG or icon font */}
                        </button>
                    )}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>

            </div>
        </header>
    );
}
