export function throttle(func, delay) {
  let lastExecTime = 0;
  let timeoutId;
  return function (...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (!lastExecTime || timeSinceLastExec >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - timeSinceLastExec);
    }
  };
}

export function throttleCd(func, delay) {
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (!lastExecTime || timeSinceLastExec >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    }
  };
}
