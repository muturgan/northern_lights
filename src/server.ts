import fs = require('fs');
import http = require('http');
import path = require('path');

import { costSource } from './sse';

http.createServer((req, res) => {
    if (req.url === '/stream') {
        costSource.subscribeCost(res);
        return;
    }

    const fileStream = fs.createReadStream(path.join(__dirname, 'index.html'));
    fileStream.pipe(res);
}).listen(8080, () => {
    console.log('Server started on 8080');
});