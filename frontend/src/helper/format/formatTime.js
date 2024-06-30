import moment from 'moment';

export const formatDDMMYYYY = (date = new Date(), split = '-') =>
  moment(new Date(date)).format(`DD${split}MM${split}YYYY`);

export const formatFullTime = (date = new Date()) =>
  moment(new Date(date)).format('hh:mm DD/MM/YYYY');
