import { describe, expect, test } from "vitest";
import {
    ErrorMessage,
    getDaysInMonth,
    getMonthName,
    getWeekDay,
    getWeekDayName,
    getDaysToPadStart,
    getDaysToPadEnd,
    getPrevMonth,
    getNextMonth,
    getNextYear,
    getPrevYear,
    CustomDate,
    Month,
    MonthType,
} from "./utils";

describe(getDaysInMonth.name, () => {
    test('correctly returns count of days for a given month', () => {
        expect(getDaysInMonth(2025, 0)).toBe(31);
        expect(getDaysInMonth(2025, 1)).toBe(28);
        expect(getDaysInMonth(2025, 9)).toBe(31);
    });
});

describe(getWeekDay.name, () => {
    test('correctly returns week day index for a given date', () => {
        expect(getWeekDay(2025, 9, 1)).toBe(3);  // Wed
        expect(getWeekDay(2025, 9, 17)).toBe(5); // Fri
        expect(getWeekDay(2025, 9, 28)).toBe(2); // Tue
    });
});

describe(getMonthName.name, () => {
    test('returns correct month name', () => {
        expect(getMonthName(0)).toBe('January');
        expect(getMonthName(5)).toBe('June');
    });

    test('throws error with invalid arguments', () => {
        expect(() => getMonthName(-1)).toThrowError(ErrorMessage.invalidMonthIndexArgument);
        expect(() => getMonthName(12)).toThrowError(ErrorMessage.invalidMonthIndexArgument);
    });
});

describe(getWeekDayName.name, () => {
    test('returns correct week day name', () => {
        expect(getWeekDayName(0)).toBe('Sunday');
        expect(getWeekDayName(4)).toBe('Thursday');
    });

    test('throws error with invalid arguments', () => {
        expect(() => getWeekDayName(-1)).toThrowError(ErrorMessage.invalidDayIndexArgument);
        expect(() => getWeekDayName(7)).toThrowError(ErrorMessage.invalidDayIndexArgument);
    });
});

describe(getDaysToPadStart.name, () => {
    test('returns number of days to pad in the beginning of a month', () => {
        expect(getDaysToPadStart(0)).toBe(6); // if month starts with Sunday - we want to show 6 days of a previous month to correctly display thre full week;
        expect(getDaysToPadStart(1)).toBe(0); // if month starts with Monday - we don't want to show previous month days;
        expect(getDaysToPadStart(4)).toBe(3);
    });

    test('throws error with invalid arguments', () => {
        expect(() => getDaysToPadStart(-1)).toThrowError(ErrorMessage.invalidDayIndexArgument);
        expect(() => getDaysToPadStart(7)).toThrowError(ErrorMessage.invalidDayIndexArgument);
    });
});

describe(getDaysToPadEnd.name, () => {
    test('returns number of days to pad at the end of a month', () => {
        expect(getDaysToPadEnd(0)).toBe(0); // if month ends with Sunday - we don't want to show next month days;
        expect(getDaysToPadEnd(1)).toBe(6); // if month ends with Monday - we want to show 6 days of the next month;
        expect(getDaysToPadEnd(5)).toBe(2);
    });

    test('throws error with invalid arguments', () => {
        expect(() => getDaysToPadEnd(-1)).toThrowError(ErrorMessage.invalidDayIndexArgument);
        expect(() => getDaysToPadEnd(7)).toThrowError(ErrorMessage.invalidDayIndexArgument);
    });
});

describe(getPrevMonth.name, () => {
    test('returns previous month index', () => {
        expect(getPrevMonth(0)).toBe(11);
        expect(getPrevMonth(11)).toBe(10);
        expect(getPrevMonth(7)).toBe(6);
    });
});

describe(getNextMonth.name, () => {
    test('returns next month index', () => {
        expect(getNextMonth(11)).toBe(0);
        expect(getNextMonth(0)).toBe(1);
        expect(getNextMonth(6)).toBe(7);
    });
});

describe(getPrevYear.name, () => {
    test('returns previous year index', () => {
        expect(getPrevYear(2025, 11)).toBe(2024);
        expect(getPrevYear(2025, 5)).toBe(2025);
        expect(getPrevYear(2025, 0)).toBe(2025);
    });
});

describe(getNextYear.name, () => {
    test('returns next year index', () => {
        expect(getNextYear(2025, 0)).toBe(2026);
        expect(getNextYear(2025, 11)).toBe(2025);
        expect(getNextYear(2025, 5)).toBe(2025);
    });
});

describe(CustomDate.name, () => {
    test('creates custom date instance', () => {
        const date = new CustomDate(2025, 9, 31);

        expect(date.monthIndex).toBe(9);
        expect(date.value).toBe(31);
        expect(date.weekDayIndex).toBe(5);
        expect(date.year).toBe(2025);
    });
});

describe(Month.name, () => {
    test('creates month instance', () => {
        const month = new Month(2025, 9, MonthType.Displayed);

        expect(month.monthIndex).toBe(9);
        expect(month.name).toBe('October');
        expect(month.year).toBe(2025);
        expect(month.type).toBe(MonthType.Displayed);
        expect(month.days.length).toBe(31);
        expect(month.days[0]).toBeInstanceOf(CustomDate);
    });
});