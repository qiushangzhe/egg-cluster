'use strict';

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

// 接受到send传递过来的参数
process.on('message', function (m) {
  // console.log(m);
  // 打印{ input: 9 }
  process.send({result: fib(m.input)});
});