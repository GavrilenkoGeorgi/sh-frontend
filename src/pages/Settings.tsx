import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import Select, { type SingleValue } from 'react-select'
import { useColorScheme, type ThemeMode } from '../hooks/useColorScheme'
import { supportedLanguages } from '../i18n'

import * as styles from './Settings.module.sass'

interface SelectOption {
  value: string
  label: string
}

const themeModes: ThemeMode[] = ['system', 'dark', 'light']

const selectClassNames = {
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

const Settings: FC = () => {
  const { t, i18n } = useTranslation()
  const { mode, setThemeMode } = useColorScheme()

  const themeOptions: SelectOption[] = themeModes.map((themeMode) => ({
    value: themeMode,
    label: t(`ui.settings.themeOptions.${themeMode}`)
  }))

  const languageOptions: SelectOption[] = supportedLanguages.map(
    (language) => ({
      value: language,
      label: t(`ui.settings.languageNames.${language}`)
    })
  )

  const handleThemeChange = (option: SingleValue<SelectOption>) => {
    if (option) setThemeMode(option.value as ThemeMode)
  }

  const handleLanguageChange = (option: SingleValue<SelectOption>) => {
    if (option) i18n.changeLanguage(option.value)
  }

  const currentTheme = themeOptions.find((option) => option.value === mode)
  const currentLanguage = languageOptions.find(
    (option) => option.value === (i18n.resolvedLanguage ?? i18n.language)
  )

  return (
    <section className={styles.container}>
      <h1>{t('ui.headings.settings')}</h1>

      <div className={styles.card}>
        <div className={styles.setting}>
          <label className={styles.label} htmlFor="theme-select">
            {t('ui.settings.themeLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.themeHint')}</p>
          <Select
            inputId="theme-select"
            unstyled
            isSearchable={false}
            options={themeOptions}
            value={currentTheme}
            onChange={handleThemeChange}
            classNames={selectClassNames}
          />
        </div>

        <div className={styles.setting}>
          <label className={styles.label} htmlFor="language-select">
            {t('ui.settings.languageLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.languageHint')}</p>
          <Select
            inputId="language-select"
            unstyled
            isSearchable={false}
            options={languageOptions}
            value={currentLanguage}
            onChange={handleLanguageChange}
            classNames={selectClassNames}
          />
        </div>
      </div>
    </section>
  )
}

export default Settings
