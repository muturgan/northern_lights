import EventEmitter = require('events');
import type { ServerResponse } from 'http';
const emitter = new EventEmitter();
const COST_EVENT = 'cost_event';

let price = 1;

setInterval(() => {
    emitter.emit(COST_EVENT, `$${++price}`);
}, 1000);

class CostSource {
    constructor(private readonly _source: EventEmitter) {}

    public subscribeCost(res: ServerResponse): void {
        res.setHeader('Content-Type',  'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection',    'keep-alive');

        this._source.on(COST_EVENT, (data) => {
            console.log(data, Boolean(res));
            res.write(`event: ${ COST_EVENT }\n`);
            res.write(`data: ${data}\n`);
            res.write('\n');
        });
    }
}

export const costSource = new CostSource(emitter);