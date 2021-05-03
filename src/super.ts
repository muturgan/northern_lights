import UWS = require('uWebSockets.js');
const port = 7777;

const handlers: Record<string, (body: unknown) => Promise<object>> = {
   '/anythinge': async (body: unknown): Promise<object> => {
      console.log('body!');
      console.log(body);
      return body as any;
   },
};

function extractJsonBody(res: UWS.HttpResponse): Promise<unknown> {
   return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      res.onData((chunk, isLast) => {
         chunks.push(new Uint8Array(chunk));
         if (isLast) {
            const buf = Buffer.concat(chunks);
            try {
               const body = JSON.parse(buf.toString('utf8'));
               return resolve(body);
            } catch (error) {
               return reject(error);               
            }
         }
      });
   });
}

const app = UWS.App().any('/*', async (res, req) => {
   res.onAborted(() => {
      res.aborted = true;
   });

   const method = req.getMethod();
   if (method !== 'post' && res.aborted !== true) {
      res.writeStatus('404').end('Not Found');
      return;
   }

   const url = req.getUrl();
   const handler = handlers[url];
   if (handler === undefined && res.aborted !== true) {
      res.writeStatus('404').end('Not Found');
      return;
   }

   try {
      const body = await extractJsonBody(res);
      const result = await handler(body);
      const message = JSON.stringify(result);
      res.end(message);
      return;
   } catch (error) {
      console.log('error!!!');
      console.log(error);
      res.writeStatus('500').end('Internal Server Error');
      return;
   } 
});

app.listen(port, (token) => {
   if (token) {
      console.log('Listening to port ' + port);
   } else {
      console.log('Failed to listen to port ' + port);
   }
});