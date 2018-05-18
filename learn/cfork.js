const cfork = require('cfork');
const util = require('util');

cfork({
  exec: '/your/app/worker.js',
  // slaves: ['/your/app/slave.js'],
  // count: require('os').cpus().length,
})
  .on('fork', worker => {
    console.warn('[%s] [worker:%d] new worker start', Date(), worker.process.pid);
  })
  .on('disconnect', worker => {
    console.warn('[%s] [master:%s] wroker:%s disconnect, exitedAfterDisconnect: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.exitedAfterDisconnect, worker.state);
  })
  .on('exit', (worker, code, signal) => {
    const exitCode = worker.process.exitCode;
    const err = new Error(util.format('worker %s died (code: %s, signal: %s, exitedAfterDisconnect: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.exitedAfterDisconnect, worker.state));
    err.name = 'WorkerDiedError';
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid, err.stack);
  })
  // if you do not listen to this event
  // cfork will output this message to stderr
  .on('unexpectedExit', (worker, code, signal) => {
    // logger what you want
  })
  .on('reachReforkLimit', () => {
    // do what you want
  });

// if you do not listen to this event
// cfork will listen it and output the error message to stderr
process.on('uncaughtException', err => {
  // do what you want
});