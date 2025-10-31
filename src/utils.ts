const week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
] as const;

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const;

export enum MonthType {
    Previous = 'previous',
    Displayed = 'displayed',
    Next = 'next',
};

export enum ErrorMessage {
    invalidDayIndexArgument = 'Invalid "dayIndex" argument value',
    invalidMonthIndexArgument = 'Invalid "monthIndex" argument value',
};

export function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

export function getWeekDay(year: number, month: number, day: number) {
    return new Date(year, month, day).getDay();
}

/**
 * 
 * @param oldMonth
 * @returns new previous month
 */
export function getPrevMonth(oldMonth: number) {
    return oldMonth === 0 ? months.length - 1 : oldMonth - 1;
}

/**
 * 
 * @param oldMonth
 * @returns  new next month
 */
export function getNextMonth(oldMonth: number) {
    return oldMonth === months.length - 1 ? 0 : oldMonth + 1;
}

/**
 * 
 * @returns new year value based on the new previous month value;
 */
export function getPrevYear(currentYear: number, newPrevMonth: number) {
    return newPrevMonth === months.length - 1 ? currentYear - 1 : currentYear;
}

/**
 * 
 * @returns new year value based on the new next month value;
 */
export function getNextYear(currentYear: number, newNextMonth: number) {
    return newNextMonth === 0 ? currentYear + 1 : currentYear;
}

/**
 * 
 * @param monthIndex index of a month in the rage [0, 11]
 * @returns name of a month
 * @throws in case index is not in the range
 */
export function getMonthName(monthIndex: number) {
    if (monthIndex < 0 || monthIndex >= months.length) throw new Error(ErrorMessage.invalidMonthIndexArgument);

    return months[monthIndex];
}

/**
 * 
 * @param dayIndex index of a week day in the range [0, 6]
 * @returns name of a week day
 * @throws in case index is not in the range
 */
export function getWeekDayName(dayIndex: number) {
    if (dayIndex < 0 || dayIndex >= week.length) throw new Error(ErrorMessage.invalidDayIndexArgument);

    return week[dayIndex];
}

/**
 * 
 * @param dayIndex index of a week day in the range [0, 6]
 * @returns number of days to pad
 * @throws in case index is not in the range
 */
export function getDaysToPadStart(dayIndex: number) {
    if (dayIndex < 0 || dayIndex >= week.length) throw new Error(ErrorMessage.invalidDayIndexArgument);
    return dayIndex === 0 ? week.length - 1 : dayIndex - 1;
}

/**
 * 
 * @param dayIndex index of a week day in the rage [0, 6]
 * @returns number of days to pad
 * @throws in case index is not in the range
 */
export function getDaysToPadEnd(dayIndex: number) {
    if (dayIndex < 0 || dayIndex >= week.length) throw new Error(ErrorMessage.invalidDayIndexArgument);
    return dayIndex === 0 ? 0 : week.length - dayIndex;
}

export class CustomDate {
    year: number;
    monthIndex: number;
    value: number;
    weekDayIndex: number;
    weekDayName: string;

    constructor(year: number, monthIndex: number, value: number) {
        this.year = year;
        this.monthIndex = monthIndex;
        this.value = value;
        this.weekDayIndex = getWeekDay(year, monthIndex, value);
        this.weekDayName = getWeekDayName(this.weekDayIndex);
    }
}

export class Month {
    year: number;
    monthIndex: number;
    name: string;
    type: MonthType;
    days: CustomDate[];

    constructor(year: number, monthIndex: number, type: MonthType) {
        this.year = year;
        this.monthIndex = monthIndex;
        this.name = getMonthName(monthIndex);
        this.type = type;

        const daysCount = getDaysInMonth(year, monthIndex);
        this.days = constructMonthDays(year, monthIndex, daysCount, getWeekDay(year, monthIndex, 1));
    }
}

export function constructMonthDays(year: number, monthIndex: number, count: number, firstDayWeekIndex: number) {
    const days = Array(count);

    for (let i = 0; i < days.length; i++) {
        const day = new CustomDate(year, monthIndex, i + 1);
        days[i] = day;

        firstDayWeekIndex = ++firstDayWeekIndex % week.length;
    }

    return days;
}

export function isSameDate(a?: CustomDate, b?: CustomDate) {
    return a && b && a.year === b.year && a.monthIndex === b.monthIndex && a.value === b.value;
}
