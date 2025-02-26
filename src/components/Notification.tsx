import React, { useEffect, useState } from "react";

type NotificationProps = {
    message: string;
    onClose: () => void;
    duration?: number; // Duration in milliseconds before auto-dismissal
    image?: string;
};

const Notification: React.FC<NotificationProps> = ({ message, onClose, duration = 3000, image }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Trigger the slide-in effect when the component is mounted

        const timer = setTimeout(() => {
            setVisible(false); // Start the slide-out animation
        }, duration);

        // Ensure `onClose` is called after the animation completes
        const closeTimer = setTimeout(() => {
            onClose(); // Trigger parent `onClose`
        }, duration + 300); // Add 300ms for transition duration

        // Cleanup timers on unmount
        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [onClose, duration]);

    // Dynamically apply slide-in/slide-out class based on `visible` state
    return (
        <div
            className={`fixed top-0 left-0 max-w-xl md:text-2xl mx-auto right-0 z-50 px-4 py-2 h-24 bg-gray-700 text-white transform transition-transform duration-300 opacity-95 ${
                visible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="h-full flex items-center justify-center flex-row gap-4">
                {image && <img src={image} alt="Notification" className="w-16 h-16 rounded-full ring-2 ring-black" />}
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Notification;