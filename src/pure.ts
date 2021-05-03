import http = require('http');

import { registrationRouteHandler, RouteHandler } from './promo.controller';

const handlers: Record<string, RouteHandler<any>> = {
   '/anythinge': registrationRouteHandler,
};

abstract class BodyParser<T, R = unknown> {
   protected abstract parseBody(bodyContai: T): Promise<R>;
}

class PureNodeAdapter extends BodyParser<http.IncomingMessage> {
   constructor(
      private readonly PORT: number,
      private readonly  routing: Record<string, RouteHandler<any>>,
   ) {
      super();
   }

   public start(): void {
      http.createServer(async (req, res) => {
         if (req.method !== 'POST') {
            return res.writeHead(404).end('Not Found');
         }
      
         const handler = this.routing[req.url as string];
         if (handler === undefined) {
            return res.writeHead(404).end('Not Found');
         }
      
         try {
            const body = await this.parseBody(req);
            const result = await handler.run(body);
            const message = JSON.stringify(result);
            return res.writeHead(200, {'content-type': 'application/json; charset=utf-8'}).end(message);
         }
         catch (error) {
            console.log('error!!!');
            console.log(error);
            return res.writeHead(500).end('Internal Server Error');
         }
      
      }).listen(this.PORT, () => {
         console.log(`Server running at http://127.0.0.1:${this.PORT}/`);
      });
   }

   protected async parseBody(req: http.IncomingMessage): Promise<unknown> {
      const chunks: Buffer[] = [];

      for await (const chunk of req) {
         chunks.push(chunk);
      }
      const buf = Buffer.concat(chunks);

      const body = JSON.parse(buf.toString('utf8'));
      return body;
   }
}

const server = new PureNodeAdapter(7777, handlers);
server.start();