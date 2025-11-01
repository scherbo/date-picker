import clsx from "clsx";
import { useRef, useState } from "react";

import {
	getDaysInMonth,
	getWeekDay,
	getDaysToPadStart,
	getDaysToPadEnd,
	getDateString,
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

interface DatePickerProps {
	open: boolean;
	date?: CustomDate;
	handleSelectDate: (date: CustomDate) => void;
	handleOpen: () => void;
	handleClose: () => void;
}

export function DatePicker(props: DatePickerProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
		if (!event.relatedTarget || !containerRef.current?.contains(event.relatedTarget)) {
			props.handleClose();
		}
	}

	return (
		<div className={styles.container} ref={containerRef} onBlur={handleBlur}>
			<button onClick={props.handleOpen}>
				{props.date ? getDateString(props.date) : '-- Select Date --'}
			</button>
			{props.open && (
				<DatePickerDropdown
					date={props.date}
					handleSelectDate={props.handleSelectDate}
					handleClose={props.handleClose}
				/>
			)}
		</div>
	);
}

interface DatePickerDropdownProps {
	date?: CustomDate;
	handleSelectDate: (d: CustomDate) => void;
	handleClose: () => void;
}

function DatePickerDropdown(props: DatePickerDropdownProps) {
	const [displayedMonthDate, setDisplayedMonthDate] = useState(
		props.date
			? new Date(props.date.year, props.date.monthIndex)
			: new Date()
	);

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

	function handlePrevMonth() {
		setDisplayedMonthDate(new Date(prevMonthYear, prevMonthIndex));
	}

	function handleNextMonth() {
		setDisplayedMonthDate(new Date(nextMonthYear, nextMonthIndex));
	}

	function handleClick(d: CustomDate) {
		props.handleSelectDate(d);

		if (d.monthIndex === prevMonthIndex) {
			handlePrevMonth()
		}

		if (d.monthIndex === nextMonthIndex) {
			handleNextMonth();
		}

		props.handleClose();
	}

	return (
		<div className={styles.dropdown} tabIndex={-1} role="dialog">
			<div className={styles.month}>
				<button type="button" onClick={handlePrevMonth}>prev</button>
				<span>{displayedMonth.name} &nbsp;{displayedMonth.year}</span>
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
				{displayedDays.map((d: CustomDate) => {
					return (
						<div
							key={`${d.value}${d.monthIndex}${d.year}`}
							className={clsx(
								styles.cell,
								d.monthIndex !== displayedMonth.monthIndex && styles.notActiveMonth,
								isSameDate(d, props.date) && styles.selected,
							)}
							onClick={() => handleClick(d)}>{d.value}
						</div>
					)
				})}
			</div>
		</div>
	);
}