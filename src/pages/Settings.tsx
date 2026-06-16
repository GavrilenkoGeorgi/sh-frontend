import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useColorScheme, type ThemeMode } from '../hooks/useColorScheme'
import { supportedLanguages } from '../i18n'
import AppSelect, { type SelectOption } from '../components/select/CustomSelect'

import * as styles from './Settings.module.sass'
import * as sharedStyles from './SharedStyles.module.sass'

const themeModes: ThemeMode[] = ['system', 'dark', 'light']

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

  const handleThemeChange = (option: SelectOption | null) => {
    if (option) setThemeMode(option.value as ThemeMode)
  }

  const handleLanguageChange = (option: SelectOption | null) => {
    if (option) i18n.changeLanguage(option.value)
  }

  const currentTheme = themeOptions.find((option) => option.value === mode)
  const currentLanguage = languageOptions.find(
    (option) => option.value === (i18n.resolvedLanguage ?? i18n.language)
  )

  return (
    <section className={sharedStyles.container}>
      <h1>{t('ui.headings.settings')}</h1>

      <div className={styles.content}>
        <div className={styles.setting}>
          <label className={styles.label} htmlFor="theme-select">
            {t('ui.settings.themeLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.themeHint')}</p>
          <AppSelect
            inputId="theme-select"
            options={themeOptions}
            value={currentTheme ?? null}
            onChange={handleThemeChange}
          />
        </div>

        <div className={styles.setting}>
          <label className={styles.label} htmlFor="language-select">
            {t('ui.settings.languageLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.languageHint')}</p>
          <AppSelect
            inputId="language-select"
            options={languageOptions}
            value={currentLanguage ?? null}
            onChange={handleLanguageChange}
          />
        </div>
      </div>
    </section>
  )
}

export default Settings
