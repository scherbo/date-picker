import { useState } from 'react';

import { DatePicker } from './DatePicker';

import styles from './App.module.css'
import type { CustomDate } from './utils';

function App() {
    const [open, setOpen] = useState(false);
	const [date, setDate] = useState<CustomDate>();

    return (
        <div className={styles.root}>
            <DatePicker
                open={open} 
                date={date}
                handleSelectDate={setDate}
                handleOpen={() => setOpen(true)}
                handleClose={() => setOpen(false)}
            />
        </div>
    )
}

export default App
