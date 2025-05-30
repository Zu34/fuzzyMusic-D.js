// utils/queueManager.js

class QueueManager {
    constructor() {
      this.queues = new Map();
    }
  
    getQueue(guildId) {
      if (!this.queues.has(guildId)) {
        this.queues.set(guildId, []);
      }
      return this.queues.get(guildId);
    }
  
    addToQueue(guildId, url) {
      const queue = this.getQueue(guildId);
      queue.push(url);
      return queue;
    }
  
    removeFromQueue(guildId, index) {
      const queue = this.getQueue(guildId);
      if (index >= 0 && index < queue.length) {
        return queue.splice(index, 1)[0];
      }
      return null;
    }
  
    clearQueue(guildId) {
      if (this.queues.has(guildId)) {
        this.queues.set(guildId, []);
      }
    }
  
    hasQueue(guildId) {
      return this.queues.has(guildId) && this.queues.get(guildId).length > 0;
    }
  
    getFirst(guildId) {
      const queue = this.getQueue(guildId);
      return queue.length > 0 ? queue[0] : null;
    }
  }
  
  module.exports = new QueueManager();
  