const ready = require('get-ready');
const obj = {};
ready.mixin(obj);

obj.ready(true);
// call immediately
obj.ready(() => console.log('ready'));

obj.ready(false);
obj.ready(() => {throw 'don\'t run'});
