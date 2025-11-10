import { useEffect, useState } from 'react';
import SearchBar from '@/Searchbars/SearchBar';
import { Button } from './button';

function FlightSearchDropDown() {
    const [isOpen, setIsOpen] = useState(false);
    const [width, setWidth] = useState(500);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setWidth(mobile ? window.innerWidth : 500);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-amber-400 hover:text-black hover:cursor-pointer hover:shadow-[0px_0px_60px] hover:border-0 hover:shadow-amber-400 border px-6 py-3 rounded-full hover:bg-amber-400 transition-all font-semibold text-sm"
            >
                <span>Search Flights</span>
            </button>

            {isMobile ? (
                /* Mobile Dropdown */
                <div
                    className={`fixed top-20 left-0 right-0 bottom-0 z-30 transition-all duration-300 transform origin-top ${isOpen
                        ? 'scale-y-100 opacity-100 pointer-events-auto'
                        : 'scale-y-0 opacity-0 pointer-events-none'
                        }`}
                >
                    <div className="w-full h-full px-4 overflow-y-auto">
                        <div className="rounded-lg shadow-2xl pb-4">
                            <div className='w-full flex justify-center pb-4'>
                            <button
                                className='bg-amber-400 text-black rounded-full w-20 h-8'
                                onClick={() => setIsOpen(false)}>Cancel</button>
                            </div>
                            <div className="w-full">
                                <SearchBar />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Desktop Centered Modal */
                <div
                    className={`fixed inset-0 z-30 flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
                        }`}
                >
                    {/* Backdrop with fade animation */}
                    <div
                        className={`absolute inset-0 transition-all duration-300 ease-in-out ${isOpen ? 'bg-black/20 opacity-100 backdrop-blur-sm' : 'opacity-0'
                            }`}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Centered Search Container */}
                    <div
                        className={`relative z-30 transition-all duration-300 transform ${isOpen
                            ? 'scale-100 opacity-100 translate-y-0'
                            : 'scale-95 opacity-0 translate-y-2'
                            }`}
                        style={{ width: `${width}px` }}
                    >
                        <p className="text-amber-400 m-auto w-full text-center py-4">
                            (Click outside to cancel)
                        </p>
                        <SearchBar />
                    </div>
                </div>
            )}

            {/* Mobile backdrop overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

export default FlightSearchDropDown;