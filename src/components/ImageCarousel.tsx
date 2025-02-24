import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
        <div className="relative w-full h-full flex items-center justify-center ">
            {/* Main Image */}
            <div className="flex justify-center items-center w-full h-full bg-black">
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain w-full h-full"
                />
            </div>

            {/* Bottom Navigation with Arrows and Index */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-white bg-gray-800 p-2 rounded shadow-lg">
                {/* Left Arrow */}
                <button
                    onClick={goToPrevious}
                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                    <FaArrowLeft />
                </button>

                {/* Image Index */}
                <div className="text-center">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={goToNext}
                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default ImageCarousel;