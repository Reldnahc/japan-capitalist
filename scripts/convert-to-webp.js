import fs from 'fs';
import path from 'path';
import sharp from 'sharp';


/**
 * Function to recursively find all PNG files in a directory.
 * @param {string} dir - The starting directory path.
 * @returns {string[]} - Array of paths to PNG files.
 */
const findPngFiles = (dir) => {
    let results = [];
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            // Recursively dive into directories
            results = results.concat(findPngFiles(filePath));
        } else if (path.extname(file).toLowerCase() === '.png') {
            // Collect PNG file paths
            results.push(filePath);
        }
    });

    return results;
};

/**
 * Converts a PNG file to WebP and saves it alongside the original.
 * @param {string} filePath - The full path to the PNG file.
 */
const convertToWebP = async (filePath) => {
    const webpPath = filePath.replace(/\.png$/i, '.webp');

    try {
        await sharp(filePath)
            .webp({ quality: 80 }) // Adjust quality here if needed (default is 80)
            .toFile(webpPath);

        console.log(`Converted: ${filePath} -> ${webpPath}`);
    } catch (err) {
        console.error(`Error converting ${filePath}:`, err);
    }
};

/**
 * Main function to convert all PNGs in a directory (recursively).
 * @param {string} rootDir - The root directory to start searching from.
 */
const convertAllPngsToWebP = async (rootDir) => {
    const pngFiles = findPngFiles(rootDir);

    if (pngFiles.length === 0) {
        console.log('No PNG files found.');
        return;
    }

    console.log(`Found ${pngFiles.length} PNG file(s). Starting conversion...`);

    for (const file of pngFiles) {
        await convertToWebP(file);
    }

    console.log('Conversion complete.');
};

// Directory to start searching (change as needed)
const rootDirectory = './public/images'; // Replace with the target directory

// Start the conversion process
convertAllPngsToWebP(rootDirectory);