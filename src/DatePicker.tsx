import clsx from "clsx";
import { useState } from "react";

import {
    getDaysInMonth,
    getWeekDay,
    padEndWeekDays,
    padStartWeekDays,
    isSameDay,
    getPrevMonth,
    getPrevYear,
    getNextMonth,
    getNextYear,
    Month,
    type TypedDay,
} from "./utils";

import styles from './DatePicker.module.scss';

export function DatePicker() {
    const [activeMonth, setActiveMonth] = useState(new Date()) // month that is shown to the user
    const [selected, setSelected] = useState<TypedDay>(); // selected date, can be outside `activeMonth`

    const currentYear = activeMonth.getFullYear();
    const currentMonthIndex = activeMonth.getMonth();

    const currentMonthDays = getDaysInMonth(currentYear, currentMonthIndex);

    const firstDayWeekIndex = getWeekDay(currentYear, currentMonthIndex, 1);
    const lastDayWeekIndex = getWeekDay(currentYear, currentMonthIndex, currentMonthDays);

    const padStartDays = padStartWeekDays(firstDayWeekIndex);
    const padEndDays = padEndWeekDays(lastDayWeekIndex);

    const currentMonth = new Month(
        currentYear,
        currentMonthIndex,
    );

    const prevMonthIndex = getPrevMonth(currentMonthIndex);
    const prevMonthYear = getPrevYear(currentMonth.year, prevMonthIndex);
    const previousMonth = new Month(
        prevMonthYear,
        prevMonthIndex,
    );

    const nextMonthIndex = getNextMonth(currentMonthIndex);
    const nextMonthYear = getNextYear(currentMonth.year, nextMonthIndex);
    const nextMonth = new Month(
        nextMonthYear,
        nextMonthIndex,
    );

    let insertIndex = 0;
    const visibleDays = Array(padStartDays + currentMonth.days.length + padEndDays);

    for (let i = previousMonth.days.length - padStartDays; i < previousMonth.days.length; i++) {
        const day = previousMonth.days[i];
        visibleDays[insertIndex] = {
            ...day,
            year: previousMonth.year,
            monthIndex: previousMonth.monthIndex,
            type: 'previous',
        }
        insertIndex++;
    }

    for (let i = 0; i < currentMonth.days.length; i++) {
        const day = currentMonth.days[i];
        visibleDays[insertIndex] = {
            ...day,
            year: currentMonth.year,
            monthIndex: currentMonth.monthIndex,
            type: 'active',
        }
        insertIndex++;
    }

    for (let i = 0; i < padEndDays; i++) {
        const day = nextMonth.days[i];
        visibleDays[insertIndex] = {
            ...day,
            year: nextMonth.year,
            monthIndex: nextMonth.monthIndex,
            type: 'next',
        }
        insertIndex++;
    }

    function handleClick(d: TypedDay) {
        setSelected(d)

        // if selected day is of next/previous month - update activeMonth
        if (d.type === 'previous') {
            handlePrevMonth()
        }

        if (d.type === 'next') {
            handleNextMonth();
        }
    }

    function handlePrevMonth() {
        setActiveMonth(new Date(prevMonthYear, prevMonthIndex));
    }

    function handleNextMonth() {
        setActiveMonth(new Date(nextMonthYear, nextMonthIndex));
    }

    return (
        <div className={styles.container}>
            <div className={styles.month}>
                <button type="button" onClick={handlePrevMonth}>prev</button>
                <span>{currentMonth.name} &nbsp; {currentMonth.year}</span>
                <button type="button" onClick={handleNextMonth}>next</button>
            </div>
            <div className={styles.week}>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
            </div>
            <div className={styles.grid}>
                {visibleDays.map((d, i) => {
                    return <div key={`${d.type}-${i}`} className={clsx(styles.cell, d.type !== 'active' && styles.notActiveMonth, isSameDay(d, selected) && styles.selected)} onClick={() => handleClick(d)}>{d.value}</div>
                })}
            </div>
        </div>
    );
}
