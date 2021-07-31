import path from 'path';
import fs from 'fs';

const START_PATH = path.join(process.cwd(), 'dist');
const IMPORT_REGEXP = /^(import [^';]* from '(\.\/|(\.\.\/)+)[^';]*)'/g;
const EXPORT_REGEXP = /^(export \* from '(\.\/|(\.\.\/)+)[^';]*)'/g;
const REPLACE_STRING = "$1.js'";
const JS_EXT = '.js';


function fixImportsAtFolder(rootPath) {
  const entries = fs.readdirSync(rootPath);

  entries.forEach((entry) => {
    const entryPath = path.join(rootPath, entry);
    if (entry.endsWith(JS_EXT)) {
      fixImportsAtFile(entryPath);
    }
    else {
      const extName = path.extname(entry);
      if (!extName) {
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
          fixImportsAtFolder(entryPath);
        }
      }
    }
  });
}

function fixImportsAtFile(filePath) {
  const content = fs.readFileSync(filePath).toString('utf8');
  const lines = content.split('\n');
  const fixedLines = lines.map((l) => l.replace(IMPORT_REGEXP, REPLACE_STRING).replace(EXPORT_REGEXP, REPLACE_STRING));
  const withFixedImports = fixedLines.join('\n');
  fs.writeFileSync(filePath, withFixedImports);
}


fixImportsAtFolder(START_PATH);
console.log('\nimports fixed...\n');
