import Rx = require('rxjs/Rx')

const btn = document.querySelector('#btn')
const btnStream$ = Rx.Observable.fromEvent(btn, 'click')
