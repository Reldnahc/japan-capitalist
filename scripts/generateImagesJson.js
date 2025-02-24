const fs = require("fs");
const path = require("path");

// Define the directory containing images relative to the script's location
const IMAGES_DIR = path.join(__dirname, "../public/images");
const OUTPUT_FILE = path.join(__dirname, "../public/images.json");

// Allowed image extensions
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"];

const generateImagesJson = () => {
    try {
        // Check if the images directory exists
        if (!fs.existsSync(IMAGES_DIR)) {
            throw new Error(`Images folder not found: ${IMAGES_DIR}`);
        }

        // Get all files in the images directory
        const files = fs.readdirSync(IMAGES_DIR);

        // Filter and return only allowed image paths
        const imagePaths = files
            .filter((file) => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase())) // Keep valid image extensions
            .map((file) => `/japan-capitalist/images/${file}`); // Prefix with the folder path

        // Write the array of image paths to the JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagePaths, null, 4)); // Pretty-print JSON

        console.log(`✅ Successfully generated images.json with ${imagePaths.length} images.`);
    } catch (err) {
        console.error(`❌ Error generating images.json: ${err.message}`);
    }
};

// Run the script
generateImagesJson();