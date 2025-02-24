import React, { useState } from "react";

// Define Prop Types
interface ImageCarouselProps {
    images: string[]; // Array of image paths
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // Track the currently displayed image

    // Handlers for arrows
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Main Image */}
            <div className="flex justify-center items-center h-64 bg-black">
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            {/* Left Arrow */}
            <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700"
            >
                ←
            </button>

            {/* Right Arrow */}
            <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700"
            >
                →
            </button>

            {/* Image Index Indicator */}
            <div className="text-center text-white mt-2">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageCarousel;