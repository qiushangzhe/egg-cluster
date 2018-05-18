'use strict';
// 事件管理器
const EventEmitter = require('events');

// worker manager to record agent and worker forked by egg-cluster
// can do some check stuff here to monitor the healthy

// 自定义了一个事件管理器
class Manager extends EventEmitter {
  constructor() {
    super();
    // 线程池
    this.workers = new Map();
    // 代理？
    this.agent = null;
  }

  setAgent(agent) {
    this.agent = agent;
  }

  deleteAgent() {
    this.agent = null;
  }

  setWorker(worker) {
    this.workers.set(worker.process.pid, worker);
  }

  getWorker(pid) {
    return this.workers.get(pid);
  }

  deleteWorker(pid) {
    this.workers.delete(pid);
  }

  listWorkerIds() {
    // 获取当前所有的线程id 是一个数组
    return Array.from(this.workers.keys());
  }


  getListeningWorkerIds() {
    const keys = [];
    for (const id of this.workers.keys()) {
      if (this.getWorker(id).state === 'listening') {
        keys.push(id);
      }
    }
    return keys;
  }

  count() {
    return {
      agent: (this.agent && this.agent.status === 'started') ? 1 : 0,
      worker: this.listWorkerIds().length,
    };
  }

  // check agent and worker must both alive
  // if exception appear 3 times, emit an exception event
  // 检查agent和worker必须都alive 如果异常出现3次, 抛出 异常事件
  startCheck() {
    // 异常
    this.exception = 0;
    this.timer = setInterval(() => {
      const count = this.count();
      if (count.agent && count.worker) {
        this.exception = 0;
        return;
      }
      this.exception++;
      if (this.exception >= 3) {
        // 抛出异常
        this.emit('exception', count);
        clearInterval(this.timer);
      }
    }, 10000);
  }
}

module.exports = Manager;
