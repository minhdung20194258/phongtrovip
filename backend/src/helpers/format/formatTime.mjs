import moment from 'moment';

export const formatDDMMYYYY = (date, split = '-') =>
  moment(new Date(date)).format(`DD${split}MM${split}YYYY`);

export const formatFullTime = (date) => moment(new Date(date)).format('hh:mm DD/MM/YYYY');
