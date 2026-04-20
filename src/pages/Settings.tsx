import { type FC, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useColorScheme, type ThemeMode } from '../hooks/useColorScheme'
import { supportedLanguages } from '../i18n'

import * as styles from './Settings.module.sass'

const themeModes: ThemeMode[] = ['system', 'dark', 'light']

const Settings: FC = () => {
  const { t, i18n } = useTranslation()
  const { mode, setThemeMode } = useColorScheme()

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setThemeMode(event.target.value as ThemeMode)
  }

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <section className={styles.container}>
      <h1>{t('ui.headings.settings')}</h1>

      <div className={styles.card}>
        <div className={styles.setting}>
          <label className={styles.label} htmlFor="theme-select">
            {t('ui.settings.themeLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.themeHint')}</p>
          <select
            id="theme-select"
            className={styles.select}
            value={mode}
            onChange={handleThemeChange}
          >
            {themeModes.map((themeMode) => (
              <option key={themeMode} value={themeMode}>
                {t(`ui.settings.themeOptions.${themeMode}`)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.label} htmlFor="language-select">
            {t('ui.settings.languageLabel')}
          </label>
          <p className={styles.hint}>{t('ui.settings.languageHint')}</p>
          <select
            id="language-select"
            className={styles.select}
            value={i18n.resolvedLanguage ?? i18n.language}
            onChange={handleLanguageChange}
          >
            {supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`ui.settings.languageNames.${language}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}

export default Settings
