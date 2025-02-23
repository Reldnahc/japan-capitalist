import React, { useState } from "react";

const CreditsSection: React.FC = () => {
    const [isAttributionOpen, setIsAttributionOpen] = useState(false); // State to toggle the panel

    // Toggle the openable panel
    const toggleAttributions = () => {
        setIsAttributionOpen(!isAttributionOpen);
    };

    return (
        <div className="text-center mt-8 px-4">
            {/* Main Heading */}
            <h1 className="text-gray-100 text-4xl font-bold mb-6">Credits</h1>

            {/* Development Section */}
            <div className="mb-6">
                <h2 className="text-white text-2xl font-bold underline">Development</h2>
                <p className="text-gray-100 text-xl mt-2">Chandler</p>
            </div>

            {/* Playtesting Section */}
            <div className="mb-6">
                <h2 className="text-white text-2xl font-bold underline">Playtesting</h2>
                <p className="text-gray-100 text-xl mt-2">
                    Victor, Despot, Danielle, Logan, Aaron
                </p>
            </div>

            {/* Attributions Section */}
            <div className="mb-6">
                <button
                    onClick={toggleAttributions}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition ease-in-out duration-300"
                >
                    {isAttributionOpen ? "Hide Attributions" : "Show Attributions"}
                </button>

                {isAttributionOpen && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-lg">
                        <h2 className="text-black text-2xl font-bold">Attributions</h2>
                        <ul className="text-gray-700 text-lg list-disc list-inside mt-3">
                            <li>
                                <span>Cash Register sound by kiddpark – </span>
                                <a
                                    href="https://freesound.org/s/201159/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline hover:text-blue-700"
                                >
                                    https://freesound.org/s/201159/
                                </a>
                                <span> – License: Attribution 4.0</span>
                            </li>
                            <li>
                                <span>Tacking paper to a cork board by pfranzen – </span>
                                <a
                                    href="https://freesound.org/s/266894/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline hover:text-blue-700"
                                >
                                    https://freesound.org/s/201159/
                                </a>
                                <span> – License: Attribution 4.0</span>
                            </li>
                            {/* Add more attributions here if necessary */}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditsSection;