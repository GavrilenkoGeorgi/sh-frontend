import React, { type FC } from 'react'
import { useSearchParams } from 'react-router'
import UpdatePwdForm from '../components/forms/UpdatePwd'
import ForgotPwdForm from '../components/forms/ForgotPwd'
import * as styles from './Register.module.sass'

const Password: FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <section className={styles.container}>
      <h1>Restore password</h1>
      {searchParams.size === 0 ? ( // TODO: this whole construct looks strange, do something better
        <ForgotPwdForm />
      ) : (
        <>{token != null && <UpdatePwdForm token={token} />}</>
      )}
    </section>
  )
}

export default Password
