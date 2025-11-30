declare module 'moment-hijri' {
  import { Moment } from 'moment';

  interface MomentHijri extends Moment {
    iYear(): number;
    iMonth(): number;
    iDate(): number;
    iDayOfYear(): number;
    iWeek(): number;
    iWeekYear(): number;
    format(format?: string): string;
  }

  function moment(date?: any): MomentHijri;

  export = moment;
}
