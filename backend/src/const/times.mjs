export const DAY = 'day';
export const WEEK = 'week';
export const MONTH = 'month';
export const YEAR = 'year';

/**
 * @param interval {'day' | 'week' | 'month' | 'year'}
 * @return {number}
 */
export const getDays = (interval) => {
  switch (interval) {
    case DAY:
      return 1;
    case WEEK:
      return 7;
    case MONTH:
      return 30;
    case YEAR:
      return 365;
  }
};
