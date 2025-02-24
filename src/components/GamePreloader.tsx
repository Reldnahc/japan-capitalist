import { useState, useEffect } from "react";
import Game from "./Game"; // Adjust path as needed

const GamePreloader = () => {
    const [isReady, setIsReady] = useState(false); // Tracks loading state
    const [hasError, setHasError] = useState(false); // Tracks loading errors
    const [loadingProgress, setLoadingProgress] = useState(0); // Track percentage of images loaded

    useEffect(() => {
        const loadImages = async () => {
            try {
                // Fetch the image paths from the JSON file
                const response = await fetch('/japan-capitalist/images.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch images.json: ${response.statusText}`);
                }

                const imagePaths: string[] = await response.json();

                // Preload images and track progress
                let loaded = 0;
                await Promise.all(
                    imagePaths.map(
                        (path) =>
                            new Promise<void>((resolve, reject) => {
                                const img = new Image();
                                img.src = path;
                                img.onload = () => {
                                    loaded++;
                                    setLoadingProgress((loaded / imagePaths.length) * 100); // Update progress
                                    resolve();
                                };
                                img.onerror = (err) => reject(err);
                            })
                    )
                );
                console.log("All images loaded! " + loaded);
                setIsReady(true); // Set ready state to true once all images are loaded
            } catch (error) {
                console.error("Error preloading images:", error);
                setHasError(true); // Show an error message if something fails
            }
        };

        loadImages();
    }, []);

    // Loading or error states
    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white text-xl flex-col">
                {hasError ? (
                    <div>Error loading resources, please refresh the page.</div>
                ) : (
                    <div>
                        Loading... {Math.floor(loadingProgress)}%
                    </div>
                )}
            </div>
        );
    }

    // Render game whenever loading is complete
    return (
        <div className="bg-gray-800 min-h-screen flex items-center justify-center">
            <Game />
        </div>
    );
};

export default GamePreloader;