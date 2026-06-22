import { type FC } from 'react'

import RegisterForm from '../components/forms/Register'
import * as styles from './SharedStyles.module.sass'
import { useTranslation } from 'react-i18next'

const Register: FC = () => {
  const { t } = useTranslation()
  return (
    <section className={styles.container}>
      <h1>{t('ui.headings.register')}</h1>
      <RegisterForm />
    </section>
  )
}

export default Register
