const path = require('path');
const fs = require('fs');

const TRASH_EXPORT = 'export {};';

const rootPath = path.join(process.cwd(), 'static', 'js', 'generated');
const files = fs.readdirSync(rootPath);

files.forEach((fileName) => {
    const filePath = path.join(rootPath, fileName);
    const content = fs.readFileSync(filePath).toString('utf8');
    const cleaned = content.replace(TRASH_EXPORT, '');
    fs.writeFileSync(filePath, cleaned);
    console.log(`${fileName} cleaned`);
});

