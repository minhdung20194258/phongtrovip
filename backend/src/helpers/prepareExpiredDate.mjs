import {EXPIRATION_PERMANENT, EXPIRATION_SPECIFIC_DATE} from '../const/expiredDate.mjs';
import moment from 'moment';

/**
 * @param {string} expiredAfter
 * @param {Date} date
 * @param {number} multiplier
 * @returns {null|Date}
 */
export default function prepareExpiredDate(expiredAfter, date = new Date(), multiplier = 1) {
  if (!expiredAfter || expiredAfter === EXPIRATION_PERMANENT) {
    return null;
  }
  const [value, unit] = [
    expiredAfter.replace(/[^0-9]/g, '') * multiplier,
    expiredAfter.replace(/[^a-zA-Z]+/g, ''),
  ];

  switch (unit) {
    case 'min':
      date.setMinutes(date.getMinutes() + value);
      break;
    case 'h':
      date.setHours(date.getHours() + value);
      break;
    case 'D':
      date.setDate(date.getDate() + value);
      break;
    case 'W':
      date.setDate(date.getDate() + value * 7);
      break;
    case 'M':
      date.setMonth(date.getMonth() + value);
      break;
    case 'Y':
      date.setFullYear(date.getFullYear() + value);
      break;
    case EXPIRATION_SPECIFIC_DATE: {
      const today = moment();
      const newDate = moment(`${today.year()}-${expiredAfter}`);

      if (newDate.format('MM:DD') === today.format('MM:DD')) {
        return newDate.year(today.year() + 1).toDate();
      }
      return newDate.toDate();
    }
  }
  return date;
}
