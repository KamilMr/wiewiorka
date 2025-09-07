import * as dateFns from 'date-fns';
import * as dateFnsTz from '@date-fns/tz';
import {pl} from 'date-fns/locale';

type TimezoneAlias = 'eu/war' | 'utc';
type TimezoneIANA = 'Europe/Warsaw' | 'UTC';

type FormatKey =
  | 'dateTimeSeconds'
  | 'timeSecondsDate'
  | 'timeDashDate'
  | 'timeSeconds'
  | 'timeMinutes'
  | 'timeMilliseconds'
  | 'dateOnly'
  | 'dateOnly2'
  | 'dateTimeOrdinal'
  | 'dateTimeWeekday';

const TIMEZONE_ALIASES: Record<TimezoneAlias, TimezoneIANA> = {
  'eu/war': 'Europe/Warsaw',
  utc: 'UTC',
};

const PREDEFINED_FORMATS: Record<FormatKey, string> = {
  // Full date and time formats
  dateTimeSeconds: 'dd/MM/yyyy HH:mm:ss',
  timeSecondsDate: 'HH:mm:ss dd/MM/yyyy',
  timeDashDate: 'HH:mm - dd/MM/yyyy', // used

  // Time only formats
  timeSeconds: 'HH:mm:ss',
  timeMinutes: 'HH:mm',
  timeMilliseconds: 'HH:mm:ss.SSS', // used

  // Date only formats
  dateOnly: 'dd/MM/yyyy',
  dateOnly2: 'yyyy-MM-dd',

  // Special formats
  dateTimeOrdinal: 'do MMM yyyy HH:mm', // used
  dateTimeWeekday: 'eee dd MMM HH:mm', // used
};

interface FormatDateTzOptions {
  date?: Date | string;
  timeZone?: TimezoneAlias;
  pattern?: string;
}

const formatDateTz = ({
  date = new Date(),
  timeZone = 'eu/war',
  pattern = PREDEFINED_FORMATS.dateTimeSeconds,
}: FormatDateTzOptions = {}): string => {
  // Assertions for date parameter
  if (!(date instanceof Date) && typeof date !== 'string')
    throw new Error('Date parameter must be a Date object or UTC string');

  if (typeof date === 'string' && isNaN(Date.parse(date)))
    throw new Error('Date string must be a valid UTC string');

  const nd = new dateFnsTz.TZDate(date, TIMEZONE_ALIASES[timeZone]);
  return dateFns.format(nd, pattern, {locale: pl}).toString();
};

export default formatDateTz;
export {TIMEZONE_ALIASES as timeAliases, PREDEFINED_FORMATS as timeFormats};
export type {TimezoneAlias, FormatKey, FormatDateTzOptions};
