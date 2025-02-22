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

    const options: ISourceOptions = useMemo(
        () => ( {
                fullScreen: false, // Particles will cover the full screen
                background: {
                    color: "#374151", // Black background for contrast
                },
                fpsLimit: 60, // Maximum frames per second
                particles: {
                    number: {
                        value: 100, // Total number of particles
                        density: {
                            enable: true,
                            area: 200, // Spread particles over the visible area
                        },
                    },
                    color: {
                        value: "#FFD700", // Yellow color for stars
                    },
                    shape: {
                        type: "star", // Use the star shape
                    },
                    opacity: {
                        value: 0.8, // Slightly transparent stars
                        random: false, // Opacity remains constant
                    },
                    size: {
                        value: { min: 5, max: 10 }, // Randomized size for variation
                        random: true, // Sizes will vary for each star
                    },
                    move: {
                        enable: true, // Enable movement
                        speed: 2, // Slow falling speed
                        direction: "bottom", // Make stars fall downward
                        random: false, // Consistent direction
                        outModes: {
                            default: "out", // Stars will leave the screen after falling
                        },
                    },
                    rotate: {
                        value: 0, // Initial rotation angle (starts at 0 degrees)
                        random: true, // Randomize initial rotation for each particle
                        direction: "clockwise", // Make stars rotate clockwise
                        animation: {
                            enable: true, // Enable animation for rotation
                            speed: 7, // Control the speed of rotation
                            sync: false, // Each star rotates independently
                        },
                    },
                },
                detectRetina: true, // Support high-DPI devices
            }
        ),
        [],
    );

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
            <div className=" relative inset-0 flex items-center justify-center z-50 pointer-events-none">
                    {particlesElement}

                <div className="rounded-lg w-full max-w-lg pt-3 shadow-xl pointer-events-auto relative">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        X
                    </button>

                    {/* Panel Title */}
                    <h2 className="text-xl md:text-3xl font-bold mb-4 ml-3 text-white font-fredoka z-10">{title}</h2>

                    {/* Panel Content */}
                    {children}
                </div>
            </div>
        </>
    );
};

export default ModalPanel;