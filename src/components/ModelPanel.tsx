import React from "react";

interface ModalPanelProps {
    title: string; // Title of the panel
    onClose: () => void; // Function to close the panel
    children: React.ReactNode; // Content to render inside the panel
}

const ModalPanel: React.FC<ModalPanelProps> = ({ title, onClose, children }) => {
    return (
        <>
            {/* Dimmed Background */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose} // Close the panel on overlay click
            ></div>

            {/* Panel Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-gray-300 rounded-lg w-full max-w-lg py-6 shadow-xl pointer-events-auto relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Close
                    </button>

                    {/* Panel Title */}
                    <h2 className="text-xl md:text-2xl font-bold mb-4 ml-3 font-fredoka">{title}</h2>

                    {/* Panel Content */}
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalPanel;