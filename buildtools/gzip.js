import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import zlib from 'zlib';

const EXTENSIONS = ['.html', '.css', '.js'];
const IMG_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const STATIC_ROOT = path.join(process.cwd(), 'static');

// delete old gziped
cp.exec(`find ./static \\( -iname *.gz -o -iname *.br \\) -type f -delete`);

compressFolder(STATIC_ROOT);


function compressFolder(rootPath) {
   const entries = fs.readdirSync(rootPath);

   entries.forEach((entry) => {
      const entryPath = path.join(rootPath, entry);
      if (EXTENSIONS.some((ext) => entry.endsWith(ext))) {
         compressFile(entryPath);
      }
      else if (IMG_EXTENSIONS.some((ext) => entry.endsWith(ext))) {
         entry.endsWith(IMG_EXTENSIONS[0])
            ? pngToWebp(entryPath)
            : jpgToWebp(entryPath);
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
  //  cp.exec(`gzip -9 -c ${filePath} > ${filePath}.gz`);
  const fileBuf = fs.readFileSync(filePath);
  const gzipBuf = zlib.gzipSync(fileBuf, {level: 9});
  const brBuf = zlib.brotliCompressSync(fileBuf);
  fs.writeFileSync(filePath + '.gz', gzipBuf);
  fs.writeFileSync(filePath + '.br', brBuf);
}

function jpgToWebp(filePath) {
   cp.exec(`cwebp -af -m 6 -mt -q 100 ${filePath} -o ${filePath}.webp -quiet`);
}

function pngToWebp(filePath) {
   cp.exec(`cwebp -af -m 6 -mt -lossless -near_lossless 95 ${filePath} -o ${filePath}.webp -quiet`);
}
