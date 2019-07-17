import { MESSAGE } from '../configs.client';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const belongToDifferentTimeGroup = (a, b) => {
  if (!a || !a.time || !b || !b.time) {
    return true;
  }

  return Math.abs(a.time - b.time) > MESSAGE.MAX_INACTIVE_TIME_IN_SECONDS * 1000;
}

export const classifyMessages = (messages) => {
  return JSON.parse(JSON.stringify(messages))
    .sort((a, b) => a.time > b.time ? 1 : -1)
    .map((message, index, arr) => {
      const prev = arr[index - 1];
      const next = arr[index + 1];
      message.isNewTime = belongToDifferentTimeGroup(prev, message);
      message.isFirst = message.isNewTime || prev.from !== message.from;
      message.isLast = belongToDifferentTimeGroup(message, next) || next.from !== message.from;

      return message;
    });
}

export const stringifyTime = (time, shortFormat = false) => {
  const date = new Date(time);
  if (!date || date.toString() === 'Invalid Date') {
    return 'Invalid Date';
  }

  const hourRaw = date.getHours();
  const am = hourRaw - 12 < 0 ? 'am' : 'pm';
  const hour = hourRaw < 13 ? hourRaw: hourRaw - 12;
  const minuteRaw = date.getMinutes();
  const minute = minuteRaw > 9 ? minuteRaw: `0${minuteRaw}`;
  const clock = `${hour}:${minute} ${am}`;

  if (shortFormat) return clock;

  const now = new Date().getTime();
  const DAY = 24 * 60 * 60 * 1000;
  const day = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];

  if ((now - time) < DAY) {
    return `Today, ${clock}`;
  }
  else if ((now - time) < (DAY * 2)) {
    return `Yesterday, ${clock}`;
  }
  else if ((now - time) < DAY * 7) {
    return `${day}, ${clock}`;
  }
  else if (date > new Date(new Date(now).getFullYear(), 0)){
    return `${date.getDate()} ${month}, ${clock}`
  }
  else {
    return `${date.getDate()} ${month} ${date.getFullYear()}, ${clock}`;
  }
}