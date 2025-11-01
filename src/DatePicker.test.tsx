// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DatePicker } from "./DatePicker";
import { getDateString, getMonthName, getNextYear, getPrevYear, type CustomDate } from "./utils";

function DatePickerWrapper() {
    const [open, setOpen] = useState(false);
	const [date, setDate] = useState<CustomDate>();

    return (
        <DatePicker
            open={open} 
            date={date}
            handleSelectDate={setDate}
            handleOpen={() => setOpen(true)}
            handleClose={() => setOpen(false)}
        />
    );
}

afterEach(cleanup)

describe(DatePicker.name, () => {
    test('is rendered correctly', () => {
        render(<DatePickerWrapper />);

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = date.getMonth();

        const trigger: HTMLButtonElement = screen.getByRole('button');
        expect(trigger).toBeDefined();

        const dropdown: HTMLDivElement | null = screen.queryByRole('dialog');
        expect(dropdown).toBeNull();

        fireEvent(
            trigger,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        expect(dropdown).toBeDefined();

        const prev = screen?.getByText('prev')
        const next = screen?.getByText('next')

        expect(prev).toBeDefined();
        expect(next).toBeDefined();

        const initialMonthTitle = `${getMonthName(mm)} ${yyyy}`;

        expect(screen.getByText(initialMonthTitle)).toBeDefined();
    });

    test('next and prev buttons work correctly', () => {
        render(<DatePickerWrapper />);

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = date.getMonth();

        const trigger: HTMLButtonElement = screen.getByRole('button');

        fireEvent(
            trigger,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        const prev = screen?.getByText('prev');
        const next = screen?.getByText('next');

        fireEvent(
            prev,
            new MouseEvent('click', { bubbles: true, cancelable: true })
        );

        let newMonthTitle = `${getMonthName(mm - 1)} ${getPrevYear(yyyy, mm - 1)}`;

        expect(screen.getByText(newMonthTitle)).toBeDefined();

        fireEvent(
            next,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        fireEvent(
            next,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        newMonthTitle = `${getMonthName(mm + 1)} ${getNextYear(yyyy, mm + 1)}`

        expect(screen.getByText(newMonthTitle)).toBeDefined();
    });

    test('date selection works correctly', () => {
        render(<DatePickerWrapper />);

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = date.getMonth();

        const trigger: HTMLButtonElement = screen.getByRole('button');
        const dropdown: HTMLDivElement | null = screen.queryByRole('dialog');

        fireEvent(
            trigger,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        const fifteenth = screen.getByText('15');

        fireEvent(
            fifteenth,
            new MouseEvent('click', { bubbles: true, cancelable: true }),
        );

        expect(dropdown).toBeNull();
        expect(trigger.textContent).toBe(getDateString(new Date(yyyy, mm, 15)));
    });
})