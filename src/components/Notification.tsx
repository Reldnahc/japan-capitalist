import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationProps = {
    message: string;
    onClose: () => void;
    duration?: number; // Duration in milliseconds before auto-dismissal
    image?: string;
    milestone?: number;
};

const Notification: React.FC<NotificationProps> = ({ message, onClose, duration = 3000, image, milestone }) => {
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        setIsActive(true);
        const timer = setTimeout(() => {
            setIsActive(false);
            setTimeout(onClose, 300); // Wait for animation to finish
        }, duration);

        return () => clearTimeout(timer);
    }, [message, onClose, duration, milestone]);

    // Motion variants for animation
    const variants = {
        hidden: {
            opacity: 0, // Start fully transparent
            y: -20, // Slight upward translation
        },
        visible: {
            opacity: 1, // Fade in to full opacity
            y: 0, // Reset translation
            transition: { duration: 0.3 }, // Animation duration
        },
        exit: {
            opacity: 0, // Fade out
            y: -20, // Slight upward translation for exit
            transition: { duration: 0.3 },
        },
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="fixed top-2 left-0 max-w-80 md:max-w-lg rounded-lg border-2 border-gray-100 md:text-2xl mx-auto right-0 z-50 px-4 py-3 h-28 bg-gray-700 text-white opacity-95"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                >
                    <div className="flex items-center gap-4">
                        {image && (
                            <div className="flex-shrink-0 w-24 h-24 relative">
                                <div
                                    className="w-full h-full bg-gray-200 rounded-full ring-4 ring-gray-800"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                {milestone && milestone > 0 && (
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-black bg-opacity-60 rounded text-white text-lg md:text-xl font-semibold">
                                        {milestone}
                                    </div>
                                )}
                            </div>
                        )}

                        <span className="flex-1 text-center">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;