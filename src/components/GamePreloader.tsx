   import React, { useState, useEffect } from "react";
   import Game from "./Game"; // Adjust path as needed

   // Function to preload images
   const preloadImages = (imagePaths: string[]): Promise<void[]> => {
       return Promise.all(
           imagePaths.map(
               (path) =>
                   new Promise((resolve, reject) => {
                       const img = new Image();
                       img.src = path;
                       img.onload = () => resolve();
                       img.onerror = (err) => reject(err);
                   })
           )
       );
   };

   // Preloader component
   const GamePreloader = () => {
       const [isReady, setIsReady] = useState(false); // Tracks loading state
       const [hasError, setHasError] = useState(false); // Tracks loading errors

       // List of all image paths to preload
       const imagePaths = [
           "/path/to/image1.webp",
           "/path/to/image2.webp",
           "/path/to/image3.webp",
           "/path/to/image4.webp",
       ];

       useEffect(() => {
           // Start preloading images
           preloadImages(imagePaths)
               .then(() => setIsReady(true)) // Set to ready when all images are loaded
               .catch((error) => {
                   console.error("Error preloading images:", error);
                   setHasError(true); // Handle any loading errors
               });
       }, []);

       // Loading or error states
       if (!isReady) {
           return (
               <div className="flex items-center justify-center h-screen bg-black text-white">
                   {hasError ? (
                       <div>Error loading resources, please refresh the page.</div>
                   ) : (
                       <div>Loading...</div>
                   )}
               </div>
           );
       }

       // Render game whenever loading is complete
       return <Game />;
   };

   export default GamePreloader;