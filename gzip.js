const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const EXTENSIONS = ['.html', '.css', '.js'];
const STATIC_ROOT = path.join(process.cwd(), 'static');

compressFolder(STATIC_ROOT);


function compressFolder(rootPath) {
   const entries = fs.readdirSync(rootPath);

   entries.forEach((entry) => {
      const entryPath = path.join(rootPath, entry);
      if (EXTENSIONS.some((ext) => entry.endsWith(ext))) {
         compressFile(entryPath);
      }
      else {
         const extName = path.extname(entry);
         if (!extName) {
            const stat = fs.statSync(entryPath);
            if (stat.isDirectory()) {
               compressFolder(entryPath);
            }
         }
      }
   });
}

function compressFile(filePath) {
   cp.exec(`gzip -9 -c ${filePath} > ${filePath}.gz`);
}
