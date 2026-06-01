import { type FC } from 'react'
import { useSearchParams } from 'react-router'
import UpdatePwdForm from '../components/forms/UpdatePwd'
import ForgotPwdForm from '../components/forms/ForgotPwd'
import * as styles from './Register.module.sass'
import { useTranslation } from 'react-i18next'

const Password: FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { t } = useTranslation()

  return (
    <section className={styles.container}>
      <h1>{t('ui.headings.restorePassword')}</h1>
      {searchParams.has('token') && token ? (
        <UpdatePwdForm token={token} />
      ) : (
        <ForgotPwdForm />
      )}
    </section>
  )
}

export default Password
