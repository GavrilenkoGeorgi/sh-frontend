import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import clsx from 'clsx'
import { useState, type FC } from 'react'
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Dialog,
  DialogTrigger,
  Popover,
  RangeCalendar
} from 'react-aria-components'
import * as styles from './RangeDatePicker.module.sass'
import CalendarIcon from '../../assets/svg/icon-calendar.svg'
import { formatDate, MONTHS } from '../../utils'

interface Props {
  label: string
  value: { start: CalendarDate | null; end: CalendarDate | null }
  onChange: (range: { start: CalendarDate; end: CalendarDate }) => void
}

const RangeDatePicker: FC<Props> = ({ label, value, onChange }) => {
  const defaultFocusDate = value.start ?? today(getLocalTimeZone())
  const [isOpen, setIsOpen] = useState(false)
  const [focusedDate, setFocusedDate] = useState<CalendarDate>(defaultFocusDate)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(defaultFocusDate.year)

  const rangeValue =
    value.start && value.end ? { start: value.start, end: value.end } : null

  const triggerLabel =
    value.start && value.end
      ? `${formatDate(value.start)} – ${formatDate(value.end)}`
      : label

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric'
  }).format(new Date(focusedDate.year, focusedDate.month - 1))

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setShowMonthPicker(false)
  }

  const handleMonthSelect = (month: number) => {
    setFocusedDate(focusedDate.set({ year: pickerYear, month }))
    setShowMonthPicker(false)
  }

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button className={styles.trigger}>
        <CalendarIcon />
        <span>{triggerLabel}</span>
      </Button>
      <Popover className={styles.popover}>
        <Dialog className={styles.dialog} aria-label={label}>
          {showMonthPicker ? (
            <div className={styles.monthPicker}>
              <div className={styles.monthPickerHeader}>
                <button
                  className={styles.navBtn}
                  onClick={() => setPickerYear((y) => y - 1)}
                >
                  ‹
                </button>
                <span className={styles.pickerYear}>{pickerYear}</span>
                <button
                  className={styles.navBtn}
                  onClick={() => setPickerYear((y) => y + 1)}
                >
                  ›
                </button>
              </div>
              <div className={styles.monthGrid}>
                {MONTHS.map((name, index) => (
                  <button
                    key={name}
                    className={clsx(styles.monthBtn, {
                      [styles.selectedMonth]:
                        pickerYear === focusedDate.year &&
                        index + 1 === focusedDate.month
                    })}
                    onClick={() => handleMonthSelect(index + 1)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <RangeCalendar
              className={styles.calendar}
              aria-label={label}
              value={rangeValue}
              onChange={(range) => {
                onChange({
                  start: range.start as CalendarDate,
                  end: range.end as CalendarDate
                })
                setIsOpen(false)
              }}
              focusedValue={focusedDate}
              onFocusChange={setFocusedDate}
            >
              <header className={styles.calendarHeader}>
                <Button slot="previous" className={styles.calendarNavBtn}>
                  ‹
                </Button>
                <button
                  className={styles.calendarHeading}
                  onClick={() => {
                    setPickerYear(focusedDate.year)
                    setShowMonthPicker(true)
                  }}
                >
                  {monthLabel}
                </button>
                <Button slot="next" className={styles.calendarNavBtn}>
                  ›
                </Button>
              </header>
              <CalendarGrid className={styles.calendarGrid}>
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className={styles.calendarHeaderCell}>
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className={({
                        isSelected,
                        isSelectionStart,
                        isSelectionEnd,
                        isHovered,
                        isOutsideMonth,
                        isToday
                      }) =>
                        clsx(styles.calendarCell, {
                          [styles.selected]: isSelected,
                          [styles.selectionStart]: isSelectionStart,
                          [styles.selectionEnd]: isSelectionEnd,
                          [styles.hovered]: isHovered,
                          [styles.outsideMonth]: isOutsideMonth,
                          [styles.today]: isToday
                        })
                      }
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </RangeCalendar>
          )}
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export default RangeDatePicker
