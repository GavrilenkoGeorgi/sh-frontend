import { type FC } from 'react'
import ReactSelect from 'react-select'
import * as styles from './CustomSelect.module.sass'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  options: SelectOption[]
  value: SelectOption | null
  onChange: (option: SelectOption | null) => void
  inputId?: string
  className?: string
}

const classNames = {
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

const CustomSelect: FC<Props> = ({
  options,
  value,
  onChange,
  inputId,
  className
}) => (
  <ReactSelect
    isSearchable={false}
    unstyled
    options={options}
    value={value}
    onChange={onChange}
    inputId={inputId}
    className={className}
    classNames={classNames}
    styles={{
      control: (base) => ({ ...base, minHeight: 'unset' })
    }}
  />
)

export default CustomSelect
