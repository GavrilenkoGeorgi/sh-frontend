import { type FC } from 'react'

import LoginForm from '../components/forms/Login'
import * as sharedStyles from './SharedStyles.module.sass'
import { useTranslation } from 'react-i18next'

const Login: FC = () => {
  const { t } = useTranslation()
  return (
    <section className={sharedStyles.container}>
      <h1>{t('ui.headings.login')}</h1>
      <LoginForm />
    </section>
  )
}

export default Login
