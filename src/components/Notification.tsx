import React, { useEffect, useState } from "react";

type NotificationProps = {
    message: string;
    onClose: () => void;
    duration?: number; // Duration in milliseconds before auto-dismissal
};

const Notification: React.FC<NotificationProps> = ({ message, onClose, duration = 3000 }) => {
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
            className={`fixed top-0 left-0 max-w-xl mx-auto right-0 z-50 px-4 py-2 bg-blue-500 text-white text-center transform transition-transform duration-300 ${
                visible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            {message}
        </div>
    );
};

export default Notification;