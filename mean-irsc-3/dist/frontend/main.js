"use strict";
const Rx = require('rxjs/Rx');
const btn = document.querySelector('#btn');
const btnStream$ = Rx.Observable.fromEvent(btn, 'click');
//# sourceMappingURL=main.js.map