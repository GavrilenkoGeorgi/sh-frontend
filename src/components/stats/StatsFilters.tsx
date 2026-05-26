import { type FC, useState } from 'react'
import {
  Input,
  Label,
  NumberField,
  ToggleButton,
  ToggleButtonGroup,
  VisuallyHidden,
  type Selection
} from 'react-aria-components'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { useTranslation } from 'react-i18next'
import Select, { type SingleValue } from 'react-select'
import type { StatsFilterParams } from '../../types'
import RangeDatePicker from '../date-picker/RangeDatePicker'
import * as styles from './StatsFilters.module.sass'

const LAST_N_PRESETS = [10, 25, 50, 100] as const
type LastNPreset = (typeof LAST_N_PRESETS)[number]

interface SelectOption {
  value: string
  label: string
}

export const selectClassNames = {
  control: () => styles.selectControl,
  menu: () => styles.selectMenu,
  menuList: () => styles.selectMenuList,
  option: ({
    isFocused,
    isSelected
  }: {
    isFocused: boolean
    isSelected: boolean
  }) =>
    [
      styles.selectOption,
      isFocused && styles.selectOptionFocused,
      isSelected && styles.selectOptionSelected
    ]
      .filter(Boolean)
      .join(' '),
  singleValue: () => styles.selectSingleValue,
  dropdownIndicator: () => styles.selectDropdownIndicator,
  indicatorSeparator: () => styles.selectIndicatorSeparator
}

interface Props {
  filters: StatsFilterParams
  onChange: (filters: StatsFilterParams) => void
}

const StatsFilters: FC<Props> = ({ filters, onChange }) => {
  const { t } = useTranslation()
  const [showCustomLastN, setShowCustomLastN] = useState(
    filters.mode === 'lastN' &&
      !LAST_N_PRESETS.includes(filters.lastN as LastNPreset)
  )

  const handleModeChange = (selection: Selection) => {
    if (selection === 'all') return
    const mode = [...selection][0] as 'lastN' | 'dateRange'
    setShowCustomLastN(false)
    if (mode === 'dateRange') {
      const dateTo = today(getLocalTimeZone())
      const dateFrom = dateTo.subtract({ days: 30 })
      onChange({
        mode: 'dateRange',
        dateFrom: dateFrom.toString(),
        dateTo: dateTo.toString(),
        minScore: filters.minScore
      })
    } else {
      onChange({ mode: 'lastN', lastN: 50, minScore: filters.minScore })
    }
  }

  const presetOptions: SelectOption[] = [
    ...LAST_N_PRESETS.map((n) => ({ value: String(n), label: String(n) })),
    { value: 'custom', label: t('pages.stats.filters.presetCustom') }
  ]

  const handlePresetChange = (option: SingleValue<SelectOption>) => {
    if (!option) return
    if (option.value === 'custom') {
      setShowCustomLastN(true)
    } else {
      setShowCustomLastN(false)
      onChange({ ...filters, lastN: Number(option.value) })
    }
  }

  const dateFrom =
    filters.mode === 'dateRange' && filters.dateFrom
      ? parseDate(filters.dateFrom)
      : null

  const dateTo =
    filters.mode === 'dateRange' && filters.dateTo
      ? parseDate(filters.dateTo)
      : null

  const selectedPresetKey =
    filters.mode === 'dateRange'
      ? '50'
      : showCustomLastN ||
          !LAST_N_PRESETS.includes(filters.lastN as LastNPreset)
        ? 'custom'
        : String(filters.lastN)

  const selectedPreset =
    presetOptions.find((option) => option.value === selectedPresetKey) ?? null

  return (
    <div className={styles.filters}>
      <ToggleButtonGroup
        className={styles.modeToggle}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={new Set([filters.mode])}
        onSelectionChange={handleModeChange}
      >
        <ToggleButton id="lastN" className={styles.toggleBtn}>
          {t('pages.stats.filters.modeLastN')}
        </ToggleButton>
        <ToggleButton id="dateRange" className={styles.toggleBtn}>
          {t('pages.stats.filters.modeDateRange')}
        </ToggleButton>
        <NumberField
          className={styles.numberField}
          value={filters.minScore ?? NaN}
          minValue={0}
          onChange={(value) => {
            onChange({
              ...filters,
              minScore: isNaN(value) ? undefined : value
            })
          }}
        >
          <VisuallyHidden>
            <Label className={styles.fieldLabel}>
              {t('pages.stats.filters.minScore')}
            </Label>
          </VisuallyHidden>
          <Input
            className={styles.fieldInput}
            placeholder={t('pages.stats.filters.minScore')}
          />
        </NumberField>
      </ToggleButtonGroup>

      {filters.mode === 'lastN' && (
        <div className={styles.lastNControls}>
          <Select
            isSearchable={false}
            options={presetOptions}
            value={selectedPreset}
            onChange={handlePresetChange}
            classNames={selectClassNames}
            className={styles.presetSelect}
            unstyled
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 'unset'
              })
            }}
          />

          {showCustomLastN && (
            <NumberField
              className={styles.numberField}
              value={filters.lastN ?? NaN}
              minValue={1}
              onChange={(value) => {
                if (!isNaN(value) && value > 0) {
                  onChange({ ...filters, lastN: value })
                }
              }}
            >
              <VisuallyHidden>
                <Label>{t('pages.stats.filters.numberOfGames')}</Label>
              </VisuallyHidden>
              <Input
                className={styles.fieldInput}
                placeholder={t('pages.stats.filters.numberOfGames')}
              />
            </NumberField>
          )}
        </div>
      )}

      {filters.mode === 'dateRange' && (
        <RangeDatePicker
          label={t('pages.stats.filters.dateRange')}
          value={{ start: dateFrom, end: dateTo }}
          onChange={({ start, end }) =>
            onChange({
              ...filters,
              mode: 'dateRange',
              dateFrom: start.toString(),
              dateTo: end.toString()
            })
          }
        />
      )}
    </div>
  )
}

export default StatsFilters
