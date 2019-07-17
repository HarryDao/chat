const TIME_INTERVAL = 10;

export const Scroll = (target, to, duration) => {
  try {

    duration = Number(duration);
    if (!duration) {
      target.scrollTop = to;
      return;
    }

    const distance = to - target.scrollTop;
    const step = distance / (duration/TIME_INTERVAL);

    const interval = setInterval(() => {
      target.scrollTop += step;
      if (target.scrollTop >= to) {
        clearInterval(interval);
      }
    }, TIME_INTERVAL)
  }
  catch(err) {};
}