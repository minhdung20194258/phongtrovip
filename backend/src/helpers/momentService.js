import moment from 'moment';

export const getDiffMinutes = (date, date2 = new Date()) => {
  return Math.abs(moment(date).diff(moment(date2), 'minutes'));
};
