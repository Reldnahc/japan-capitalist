import React, {useCallback, useContext, useEffect, useMemo, useRef} from "react";
import Particles from "@tsparticles/react";
import {Container, ISourceOptions} from "@tsparticles/engine";
import {ParticlesContext} from "../contexts/ParticlesContext.tsx"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
interface ModalPanelProps {
    title: string; // Title of the panel
    onClose: () => void; // Function to close the panel
    children: React.ReactNode; // Content to render inside the panel
}

const ModalPanel: React.FC<ModalPanelProps> = ({ title, onClose, children }) => {
    const {engine, initialized } = useContext(ParticlesContext);
    const containerRef = useRef<Container | null>(null);

    const getImagesForBusiness = (business: string) => [
        {
            src: `/japan-capitalist/images/businesses/${business.toLowerCase().replace(" ","")}/bg_1.webp`,
            width: 64,
            height: 64,
        },
        {
            src: `/japan-capitalist/images/businesses/${business.toLowerCase().replace(" ","")}/bg_2.webp`,
            width: 64,
            height: 64,
        },
        {
            src: `/japan-capitalist/images/businesses/${business.toLowerCase().replace(" ","")}/bg_3.webp`,
            width: 64,
            height: 64,
        },
    ];

    const generateParticlesConfig = (panelType: string, businessName?: string): ISourceOptions => {

        const getRandomDelay = (min: number, max: number) => {
            return Math.random() * (max - min) + min; // Random value between min and max
        };

        switch (panelType) {
            case "Managers": {
                if (!businessName) {
                    return {
                        fullScreen: false,
                        background: {
                            color: "#374151",
                        }, particles: {
                            number: {value: 80},
                            color: {value: "#3498DB"}, // Blue particles
                            shape: {type: "star"},
                            size: {value: {min: 3, max: 8}},
                            move: {enable: true, speed: 1},
                            rotate: {
                                value: { min: 0, max: 360 },
                                animation: { enable: true, speed: 3, sync: false },
                            },
                        },
                    };
                }

                // Dynamic manager-specific configuration
                return {
                    fpsLimit: 60,
                    detectRetina: true,
                    fullScreen: false,
                    background: { color: "#374151" },
                    emitters: [
                        {
                            position: { x: 0, y: 0 }, // Top-left corner
                            rate: {
                                delay: getRandomDelay(2, 5),
                                quantity: 1,
                            },
                            size: {
                                width: 0,
                                height: 0,
                            },
                            particles: {
                                shape: {
                                    type: "images",
                                    options: {
                                        images: getImagesForBusiness(businessName),
                                    },
                                },
                                opacity: { value: 1 },
                                size: { value: 40 },
                                move: {
                                    enable: true,
                                    speed: 5,
                                    direction: "bottom-right", // Drift diagonally downwards
                                    outModes: { default: "destroy" },
                                },
                                rotate: {
                                    value: { min: 0, max: 360 },
                                    animation: { enable: true, speed: 10, sync: false },
                                },
                            },
                        },
                        {
                            position: { x: 100, y: 0 }, // Top-right corner
                            rate: {
                                delay: getRandomDelay(2, 5),
                                quantity: 1,
                            },
                            size: {
                                width: 0,
                                height: 0,
                            },
                            particles: {
                                shape: {
                                    type: "images",
                                    options: {
                                        images: getImagesForBusiness(businessName),
                                    },
                                },
                                opacity: { value: 1 },
                                size: { value: 40 },
                                move: {
                                    enable: true,
                                    speed: 5,
                                    direction: "bottom-left", // Drift diagonally downwards
                                    outModes: { default: "destroy" },
                                },
                                rotate: {
                                    value: { min: 0, max: 360 },
                                    animation: { enable: true, speed: 10, sync: false },
                                },
                            },
                        },
                        {
                            position: { x: 0, y: 100 }, // Bottom-left corner
                            rate: {
                                delay: getRandomDelay(2, 5),
                                quantity: 1,
                            },
                            size: {
                                width: 0,
                                height: 0,
                            },
                            particles: {
                                shape: {
                                    type: "images",
                                    options: {
                                        images: getImagesForBusiness(businessName),
                                    },
                                },
                                opacity: { value: 1 },
                                size: { value: 40 },
                                move: {
                                    enable: true,
                                    speed: 5,
                                    direction: "top-right",
                                    outModes: { default: "destroy" },
                                },
                                rotate: {
                                    value: { min: 0, max: 360 },
                                    animation: { enable: true, speed: 10, sync: false },
                                },
                            },
                        },
                        {
                            position: { x: 100, y: 100 }, // Bottom-right corner
                            rate: {
                                delay: getRandomDelay(2, 5),
                                quantity: 1,
                            },
                            size: {
                                width: 0,
                                height: 0,
                            },
                            particles: {
                                shape: {
                                    type: "images",
                                    options: {
                                        images: getImagesForBusiness(businessName),
                                    },
                                },
                                opacity: { value: 1 },
                                size: { value: 40 },
                                move: {
                                    enable: true,
                                    speed: 5,
                                    direction: "top-left",
                                    outModes: { default: "destroy" },
                                },
                                rotate: {
                                    value: { min: 0, max: 360 },
                                    animation: { enable: true, speed: 10, sync: false },
                                },
                            },
                        },
                    ],
                };

            }

            case "Settings":
                return {
                    fullScreen: false,
                    background: { color: "#374151" },
                    particles: {
                        number: { value: 50 },
                        color: { value: "#4CAF50" },
                        shape: { type: "star" },
                        move: { enable: true, speed: 3, direction: "bottom" },
                        rotate: {
                            value: { min: 0, max: 360 },
                            animation: { enable: true, speed: 3, sync: false },
                        },
                    },
                };

            case "Fans":
                return {
                    fullScreen: false,
                    background: { color: "#374151" },
                    particles: {
                        number: { value: 100 },
                        color: { value: "#FFD700" },
                        shape: { type: "star" },
                        size: {value: {min: 3, max: 5}},
                        move: { enable: true, speed: 2, direction: "bottom" },
                        rotate: {
                            value: { min: 0, max: 360 },
                            animation: { enable: true, speed: 3, sync: false },
                        },
                    },
                };

            case "Unlocks":
                return {
                    fullScreen: false,
                    background: { color: "#374151" },
                    particles: {
                        number: { value: 60 },
                        color: { value: "#F1C40F" },
                        shape: { type: "star" },
                        move: { enable: true, speed: 4, direction: "top" },
                        rotate: {
                            value: { min: 0, max: 360 },
                            animation: { enable: true, speed: 3, sync: false },
                        },
                    },
                };

            default:
                return {
                    fullScreen: false,
                    background: { color: "#374151" },
                    fpsLimit: 60,
                    particles: {
                        number: { value: 100 },
                        color: { value: "#FFD700" },
                        shape: { type: "star" },
                        opacity: { value: 0.8 },
                        size: { value: { min: 5, max: 10 }},
                        move: { enable: true, speed: 2, direction: "bottom", outModes: { default: "out" } },
                        rotate: {
                            value: 0,
                            random: true,
                            animation: { enable: true, speed: 7, sync: false },
                        },
                    },
                };
        }
    };
    const options = useMemo(() => {
        // Check if title matches "Managers - {BusinessName}" format
        if (title.includes("Managers - ")) {
            const businessName = title.split(" - ")[1]?.toLowerCase();
            return generateParticlesConfig("Managers", businessName);
        }

        // Handle non-dynamic panels like Settings, Fans, etc.
        return generateParticlesConfig(title);
    }, [title]);

    const particlesLoaded = useCallback(
        async (container?: Container): Promise<void> => {
            containerRef.current = container || null;
        },
        []
    );

    useEffect(() => {
        // Handler for escape key press
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose(); // Call the onClose function
            }
        };

        // Attach event listener
        window.addEventListener("keydown", handleKeyDown);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const particlesElement = useMemo(() => {
        if (!initialized || !engine) return null;
        return (
            <div className="absolute inset-0 max-w-lg flex overflow-y-auto justify-center rounded-lg items-center mx-auto">
                <Particles
                    id="modal-particles"
                    className="h-full z-0"
                    particlesLoaded={particlesLoaded}
                    options={options}
                />
            </div>
        );
    }, [initialized, engine, particlesLoaded, options]);


    return (
        <>
            {/* Dimmed Background */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose} // Close the panel on overlay click
            ></div>
            {/* Panel Content */}
            <div className=" fixed inset-0 flex h-[79vh] items-center justify-center z-50 pointer-events-none my-auto ">
                    {particlesElement}

                <div className="rounded-lg w-full max-w-lg pt-3 pointer-events-auto relative ">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute flex items-center justify-center top-1.5 md:top-0 right-1 bg-red-500 text-white font-extrabold p-3 h-8 w-8 rounded-lg hover:bg-red-600"
                    >
                        X
                    </button>

                    {/* Panel Title */}
                    <h2 className="text-xl md:text-3xl font-bold mb-4 ml-3 text-white font-fredoka z-10">{title}</h2>
                    <hr className="border-t border-gray-400 mx-1 my-2" />

                    {/* Panel Content */}
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalPanel;