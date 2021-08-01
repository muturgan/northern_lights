import path from 'path';
import fs from 'fs';

const START_PATH = path.join(process.cwd(), 'dist');
const IMPORT_REGEXP = /^((import|export) [^';]* from '(\.\/|(\.\.\/)+)[^';]*)'/g;
const REPLACE_STRING = "$1.js'";
const REPLACE_STRING_WITH_INDEX = "$1/index.js'";
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
  const fixedLines = lines.map((l) => {
    if (!l.match(IMPORT_REGEXP)) {
      return l;
    }

    const [_, importPath] = l.split(`'`);
    const fullPath = path.join(filePath, '..', importPath);
    const exists = fs.existsSync(fullPath);
    if (exists === false) {
      return l.replace(IMPORT_REGEXP, REPLACE_STRING);
    }

    const stat = fs.statSync(fullPath);
    const isDirectory = stat.isDirectory();
    if (isDirectory === false) {
      return l;
    }

    return l.replace(IMPORT_REGEXP, REPLACE_STRING_WITH_INDEX);
  });
  const withFixedImports = fixedLines.join('\n');
  fs.writeFileSync(filePath, withFixedImports);
}


fixImportsAtFolder(START_PATH);
console.log('imports fixed...');
