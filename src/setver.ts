import http = require('http');

import { config } from './configg';
const PORT = config.APP_PORT;

const parseBody = async <T = any>(req: http.IncomingMessage): Promise<T | null> => {
   const chunks: Buffer[] = [];
   for await (const chunk of req) {
      chunks.push(chunk);
   }
   if (chunks.length === 0) {
      return null;
   }
   const body = Buffer.concat(chunks);
   const parsed: T = JSON.parse(body.toString('utf8'));
   return parsed;
};

http.createServer(async (req, res) => {
   const body = await parseBody(req);
   console.log('body:');
   console.log(body);

   res.writeHead(200);
   res.end('Hello world!');
}).listen(PORT, config.APP_HOST, () => {
   console.log(`Server running at http://127.0.0.1:${PORT}/`);
});