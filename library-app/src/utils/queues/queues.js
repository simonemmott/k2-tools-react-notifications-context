function queue () {
  const items = [];
  for (let i=0; i< arguments.length; i++) {
    if (Array.isArray(arguments[i])) {
      arguments[i].forEach(item => items.push(item));
    } else {
      items.push(arguments[i]);
    }
  }
  const queue = {};
  queue.items = items;
  queue.accept = (item) => {
    if (queue.resolve || queue.consumer) {
      if (queue.resolve) {
        queue.resolve(item);
        queue.resolve = undefined;
        queue.promise = undefined;
      } else {
        queue.consumer(item);
      }
    } else {
      queue.items.push(item);
    }
  };
  queue.resolve = undefined;
  queue.promise = undefined;
  queue.next = () => {
    if (queue.promise) {
      return queue.promise;
    }
    if (queue.items.length > 0) {
      let p = new Promise((resolve) => {
        resolve(queue.items.shift());
      });
      queue.promise = undefined;
      queue.resolve = undefined;
      return p;
    } else {
      queue.promise = new Promise((resolve) => {
        queue.resolve = resolve;
      });
       return queue.promise;
    }
  };
  queue.size = () => {return queue.items.length;};
  queue.queued = () => {return (queue.items.length > 0);};
  queue.shift = () => {
    if (queue.items.length > 0) {
      return queue.items.shift();
    } 
  };
  queue.flush = () => {
    const items = queue.items;
    queue.items = [];
    return items;
  };
  queue.clearPromise = () => {
    queue.promise = undefined;
    queue.resolve = undefined;
  };
  return queue; 
}

export default queue;