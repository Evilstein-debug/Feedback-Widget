import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;

            // Replace .ts extensions with .js in imports
            content = content.replace(/\.ts"/g, '.js"');
            content = content.replace(/\.ts'/g, ".js'");

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Fixed imports in: ${filePath}`);
            }
        }
    }
}

if (fs.existsSync(distDir)) {
    console.log('Fixing imports in dist directory...');
    walk(distDir);
    console.log('Import fix complete.');
} else {
    console.log('Dist directory not found, skipping import fix.');
}
