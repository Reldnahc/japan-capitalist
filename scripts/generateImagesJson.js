import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file's directory using ES module methods
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory containing images
const IMAGES_DIR = path.join(__dirname, "../public/images");
const OUTPUT_FILE = path.join(__dirname, "../public/images.json");

// Allowed image extensions
const ALLOWED_EXTENSIONS = [ ".webp"];

/**
 * Function to recursively get all files in a directory and subdirectories
 * @param {string} dir - Directory to scan
 * @returns {string[]} - List of file paths
 */
const getAllImagePaths = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true }); // Read directory contents
    let images = [];

    files.forEach((file) => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            // Recursively read subdirectory
            images = images.concat(getAllImagePaths(filePath));
        } else if (file.isFile() && ALLOWED_EXTENSIONS.includes(path.extname(file.name).toLowerCase())) {
            // Add allowed image files
            const relativePath = path.relative(path.join(__dirname, "../public"), filePath); // Get path relative to `public/`
            images.push(`/japan-capitalist/${relativePath.replace(/\\/g, "/")}`); // Normalize for URL usage
        }
    });

    return images;
};

const generateImagesJson = () => {
    try {
        // Check if the images directory exists
        if (!fs.existsSync(IMAGES_DIR)) {
            throw new Error(`Images folder not found: ${IMAGES_DIR}`);
        }

        // Recursively find all image files
        const imagePaths = getAllImagePaths(IMAGES_DIR);

        // Write the array of image paths to the JSON file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imagePaths, null, 4)); // Pretty-print JSON

        console.log(`✅ Successfully generated images.json with ${imagePaths.length} images.`);
    } catch (err) {
        console.error(`❌ Error generating images.json: ${err.message}`);
    }
};

// Run the script
generateImagesJson();