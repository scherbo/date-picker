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

enum ErrorMessage {
    invalidDayIndexArgument = 'Invalid "dayIndex" argument value',
    invalidMonthIndexArgument = 'Invalid "monthIndex" argument value',
};

export type TypedDay = Day & {
    type: 'previous' | 'active' | 'next';
    monthIndex: number;
    year: number;
};

export function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

export function getWeekDay(year: number, month: number, day: number) {
    return new Date(year, month, day).getDay();
}

export function getPrevMonth(month: number) {
    return month === 0 ? months.length - 1 : month - 1;
}

export function getNextMonth(month: number) {
    return month === months.length - 1 ? 0 : month + 1;
}

export function getPrevYear(year: number, prevMonth: number) {
    return prevMonth === months.length - 1 ? year - 1 : year;
}

export function getNextYear(year: number, nextMonth: number) {
    return nextMonth === 0 ? year + 1 : year;
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
export function padStartWeekDays(dayIndex: number) {
    if (dayIndex < 0 || dayIndex >= week.length) throw new Error(ErrorMessage.invalidDayIndexArgument);
    return dayIndex === 0 ? week.length - 1 : dayIndex - 1;
}

/**
 * 
 * @param dayIndex index of a week day in the rage [0, 6]
 * @returns number of days to pad
 * @throws in case index is not in the range
 */
export function padEndWeekDays(dayIndex: number) {
    if (dayIndex < 0 || dayIndex >= week.length) throw new Error(ErrorMessage.invalidDayIndexArgument);
    return dayIndex === 0 ? 0 : week.length - dayIndex;
}

export class Day {
    value: number;
    weekDayIndex: number;
    weekDayName: string;

    constructor(value: number, weekDayIndex: number) {
        this.value = value;
        this.weekDayIndex = weekDayIndex;
        this.weekDayName = getWeekDayName(weekDayIndex);
    }
}

export class Month {
    year: number;
    monthIndex: number;
    name: string;
    days: Day[];

    constructor(year: number, monthIndex: number) {
        this.year = year;
        this.monthIndex = monthIndex;
        this.name = getMonthName(monthIndex);

        const daysCount = getDaysInMonth(year, monthIndex);
        this.days = constructDays(daysCount, getWeekDay(year, monthIndex, 1));
    }
}

export function constructDays(count: number, firstDayWeekIndex: number) {
    const days = Array(count);

    for (let i = 0; i < days.length; i++) {
        const day = new Day(i + 1, firstDayWeekIndex);
        days[i] = day;

        firstDayWeekIndex = ++firstDayWeekIndex % week.length;
    }

    return days;
}

export function isSameDay(a?: TypedDay, b?: TypedDay) {
    return a && b && a.year === b.year && a.monthIndex === b.monthIndex && a.value === b.value;
}
