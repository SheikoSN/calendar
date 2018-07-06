import * as moment from 'moment';
import cache  from 'moment-cache';

const myStorage = {};
cache.updateStorage(myStorage);

export class DatesService {
  public defaultDate: string =  '2017-02-01';
  cacheFormat = 'MM-DD-YYYY';

  getNextMonth(date: moment.Moment, format?: string) {
    let nextMonthDate = this.cacheDate(date).add(1, 'month');
    return format? nextMonthDate.format(format) : nextMonthDate;
  }

  cacheDate(date: moment.Moment) {
    return cache(date.format(this.cacheFormat), this.cacheFormat);
  }

  getPrevMonth(date: moment.Moment, format?: string) {
    let prevMonthDate = this.cacheDate(date).subtract(1, 'month');
    return format? prevMonthDate.format(format) : prevMonthDate;
  }

  getNextWeek(date: moment.Moment, format?: string) {
    let nextWeekDate = this.cacheDate(date).add(1, 'week');
    return format? nextWeekDate.format(format) : nextWeekDate;
  }

  getPrevWeek(date: moment.Moment, format?: string) {
    let prevWeekDate = this.cacheDate(date).subtract(1, 'week').subtract(1, 'day');
    return format? prevWeekDate.format(format) : prevWeekDate;
  }

  getNextDay(date: moment.Moment, format?: string) {
    let nextDay = this.cacheDate(date).add(1, 'day');
    return format? nextDay.format(format) : nextDay;
  }

  getPrevDay(date: moment.Moment, format?: string) {
    let prevDay = this.cacheDate(date).subtract(1, 'day');
    return format? prevDay.format(format) : prevDay;
  }
}
