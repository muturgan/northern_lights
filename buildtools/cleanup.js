import path from 'path';
import fs from 'fs';

const TRASH_EXPORT = 'export {};';
const JS_EXT = '.js';

const rootPath = path.join(process.cwd(), 'static', 'js', 'generated');
const files = fs.readdirSync(rootPath);

files.forEach((fileName) => {
    if (fileName.endsWith(JS_EXT)) {
        const filePath = path.join(rootPath, fileName);
        const content = fs.readFileSync(filePath).toString('utf8');
        const cleaned = content.replace(TRASH_EXPORT, '');
        fs.writeFileSync(filePath, cleaned);
        console.log(`${fileName} cleaned`);
    }
});

function removeJsFiles(rootPath) {
    const entries = fs.readdirSync(rootPath);

    entries.forEach((entry) => {
        const entryPath = path.join(rootPath, entry);

        if (entry.endsWith(JS_EXT)) {
            fs.unlinkSync(entryPath);
            return;
        }

        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
            removeJsFiles(entryPath);
        }
    });
}

const srcPath  = path.join(process.cwd(), 'src');
removeJsFiles(srcPath);
