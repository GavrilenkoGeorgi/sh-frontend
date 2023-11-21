import React, { type FC, useState, type FocusEvent } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux/es/exports'

import { LoginFormSchema, type LoginFormSchemaType } from '../../schemas/LoginFormSchema'
import { setCredentials } from '../../store/slices/authSlice'
import { useLoginMutation } from '../../store/slices/userApiSlice'
import type { FocusedStates, InputValues, LoginFormErrors } from '../../types'

import cx from 'classnames'
import styles from './Form.module.sass'
import Logout from './Logout'
import LoadingIndicator from '../layout/LoadingIndicator'

const Login: FC = () => {

  const navigate = useNavigate()
  const [login] = useLoginMutation()

  const dispatch = useDispatch()

  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({})

  const { register, getValues, formState: { errors, isSubmitting }, handleSubmit } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema)
  })

  const focusInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: true })
  }

  const blurInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: false })
    const values = getValues()
    setValues({ ...values })
    setFormErrors({ ...errors })
  }

  const onSubmit: SubmitHandler<LoginFormSchemaType> = async ({ email, password }): Promise<void> => {
    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate('/game')
    } catch (err: any) {
      console.log(err)
    }
  }

  return <form
    noValidate
    autoComplete='off'
    // eslint-disable-next-line
    onSubmit={handleSubmit(onSubmit)}
    id='login'
    className={styles.form}
  >
    <fieldset>
      <div className={styles.inputContainer}>
        <div className={cx(styles.formInput, {
          [styles.focused]: focused.email,
          [styles.hasValue]: values.email,
          [styles.error]: formErrors.email
        })}>
          <label
            className={styles.formLabel}
            htmlFor='email'
          >
            Email
          </label>
          <input
            className={styles.formInput}
            aria-label='Email'
            type='email'
            {...register('email')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>
        {(formErrors.email != null) && <p className={styles.errorMsg}>
          {formErrors.email.message}
        </p>}
      </div>

      <div className={styles.inputContainer}>
        <div className={cx(styles.formInput, {
          [styles.focused]: focused.password,
          [styles.hasValue]: values.password,
          [styles.error]: formErrors.password
        })}
        >
          <label
            htmlFor='password'
            className={styles.formLabel}>
            Password
          </label>
          <input
            className={styles.formInput}
            type='password'
            aria-label='Password'
            {...register('password')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>
        {(formErrors.password != null) && <p className={styles.errorMsg}>
          {formErrors.password.message}
        </p>}
      </div>
      <div className={styles.buttons}>
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? <LoadingIndicator dark />
            : 'Login'
          }
        </button>
        <Logout />
      </div>
    </fieldset>
  </form>
}

export default Login
