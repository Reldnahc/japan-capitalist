import React from "react";
import { Business } from "../../gameLogic/types/business.types";

type ManagerSelectionPanelProps = {
    businesses: Business[];
    onBusinessClick: (business: Business) => void;
};

const ManagerSelectionPanel: React.FC<ManagerSelectionPanelProps> = ({ businesses, onBusinessClick }) => {
    return (
        <div

            className="grid grid-cols-2 gap-3 w-full"
        >
            {businesses.map((business, index) => (
                <div
                    key={index}
                    className="shadow border-gray-500 border-2 rounded-lg p-4 bg-opacity-80 bg-gray-800 cursor-pointer hover:bg-opacity-95"
                    onClick={() => onBusinessClick(business)}
                >
                    <h3 className="text-lg md:text-2xl font-bold text-center z-20 ">{business.name}</h3>
                    <div
                        key={business.name}
                        className="relative flex flex-col items-center mx-auto w-32 h-32 md:w-40 md:h-40 bg-gray-100 px-4 py-1 shadow-sm rounded-full hover:shadow-2xl bg-no-repeat bg-center opacity-100 bg-cover transition"
                        style={{
                            backgroundImage: `url('/japan-capitalist/images/businesses/${business.name
                                .toLowerCase()
                                .replace(" ", "")}/employee_face.webp')`,
                        }}
                    ></div>
                    <h3 className="text-md md:text-lg font-semibold text-center z-20">{business.manager?.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default ManagerSelectionPanel;