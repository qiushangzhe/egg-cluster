'use strict';
const http = require('http');
const cp = require('child_process');
const server = http.createServer(function (req, res) {
  const child = cp.fork(__dirname + '/cal.js');
  // 每个请求都单独生成一个新的子进程
  child.on('message', m => {
    res.end(m.result + '\n');
  });
  // 为其指定message事件
  const input = parseInt(req.url.substring(1));
  // 和postMessage很类似，不过这里是通过send方法而不是postMessage方法来完成的
  child.send({ input });
});
server.listen(8000);
