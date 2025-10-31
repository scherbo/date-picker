import clsx from "clsx";
import { useState } from "react";

import {
	getDaysInMonth,
	getWeekDay,
	getDaysToPadStart,
	getDaysToPadEnd,
	getPrevMonth,
	getPrevYear,
	getNextMonth,
	getNextYear,
	isSameDate,
	Month,
	CustomDate,
	MonthType,
} from "./utils";

import styles from './DatePicker.module.scss';

export function DatePicker() {
	const [date, setDate] = useState<CustomDate>();
	const [displayedMonthDate, setDisplayedMonthDate] = useState(new Date())

	const currentYear = displayedMonthDate.getFullYear();
	const currentMonthIndex = displayedMonthDate.getMonth();

	const currentMonthDays = getDaysInMonth(currentYear, currentMonthIndex);

	const firstDayWeekIndex = getWeekDay(currentYear, currentMonthIndex, 1);
	const lastDayWeekIndex = getWeekDay(currentYear, currentMonthIndex, currentMonthDays);

	const daysToPadStart = getDaysToPadStart(firstDayWeekIndex);
	const daysToPadEnd = getDaysToPadEnd(lastDayWeekIndex);

	const displayedMonth = new Month(currentYear, currentMonthIndex, MonthType.Displayed);

	const prevMonthIndex = getPrevMonth(currentMonthIndex);
	const prevMonthYear = getPrevYear(displayedMonth.year, prevMonthIndex);
	const prevMonth = new Month(prevMonthYear, prevMonthIndex, MonthType.Previous);

	const nextMonthIndex = getNextMonth(currentMonthIndex);
	const nextMonthYear = getNextYear(displayedMonth.year, nextMonthIndex);
	const nextMonth = new Month(nextMonthYear, nextMonthIndex, MonthType.Next);

	let insertIndex = 0;
	const displayedDays = Array(daysToPadStart + displayedMonth.days.length + daysToPadEnd);

	for (let i = prevMonth.days.length - daysToPadStart; i < prevMonth.days.length; i++) {
		const day = prevMonth.days[i];
		displayedDays[insertIndex] = day;
		insertIndex++;
	}

	for (let i = 0; i < displayedMonth.days.length; i++) {
		const day = displayedMonth.days[i];
		displayedDays[insertIndex] = day;
		insertIndex++;
	}

	for (let i = 0; i < daysToPadEnd; i++) {
		const day = nextMonth.days[i];
		displayedDays[insertIndex] = day;
		insertIndex++;
	}

	function handleClick(d: CustomDate) {
		setDate(d)

		if (d.monthIndex === prevMonthIndex) {
			handlePrevMonth()
		}

		if (d.monthIndex === nextMonthIndex) {
			handleNextMonth();
		}
	}

	function handlePrevMonth() {
		setDisplayedMonthDate(new Date(prevMonthYear, prevMonthIndex));
	}

	function handleNextMonth() {
		setDisplayedMonthDate(new Date(nextMonthYear, nextMonthIndex));
	}

	return (
		<div className={styles.container}>
			<div className={styles.month}>
				<button type="button" onClick={handlePrevMonth}>prev</button>
				<span>{displayedMonth.name} &nbsp; {displayedMonth.year}</span>
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
				{displayedDays.map((d, i) => {
					return (
						<div
							key={`${d.type}-${i}`}
							className={clsx(
								styles.cell,
								d.monthIndex !== displayedMonth.monthIndex && styles.notActiveMonth,
								isSameDate(d, date) && styles.selected,
							)}
							onClick={() => handleClick(d)}>{d.value}
						</div>
					)
				})}
			</div>
		</div>
	);
}
