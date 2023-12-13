import React, { type FC, useState, type FocusEvent } from 'react'
import { useDispatch } from 'react-redux'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import cx from 'classnames'

import { useSignupMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { RegisterFormSchema, type RegisterFormSchemaType } from '../../schemas/RegisterFormSchema'
import type { FocusedStates, InputValues, RegisterFormErrors } from '../../types'
import { ToastTypes } from '../../types'
import { getErrMsg } from '../../utils'

import LoadingIndicator from '../layout/LoadingIndicator'
import styles from './Form.module.sass'

const Register: FC = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [signup] = useSignupMutation()

  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({})

  const { register, getValues, formState: { errors, isSubmitting }, handleSubmit } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema)
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

  const onSubmit: SubmitHandler<RegisterFormSchemaType> = async (data): Promise<void> => {
    try {
      await signup(data).unwrap()
      dispatch(setNotification({
        msg: 'All ok, you can login after activating your account.',
        type: ToastTypes.SUCCESS
      }))
      navigate('/login', { replace: true })
    } catch (err: unknown) {
      dispatch(setNotification({
        msg: getErrMsg(err),
        type: ToastTypes.ERROR
      }))
    }
  }

  return <form
    noValidate
    // eslint-disable-next-line
    onSubmit={handleSubmit(onSubmit)}
    id='register'
    className={styles.form}
  >
    <fieldset>
      <div className={styles.inputContainer}>
        <div className={cx(styles.formInput, {
          [styles.focused]: focused.name,
          [styles.hasValue]: values.name,
          [styles.error]: formErrors.name
        })}>
          <label
            htmlFor='name'
            className={styles.formLabel}
          >
            Name
          </label>
          <input
            className={styles.formInput}
            type='text'
            aria-label='Name'
            {...register('name')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>
        {(formErrors.name != null) && <p className={styles.errorMsg}>
          {formErrors.name.message}
        </p>}
      </div>

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
            type='email'
            aria-label='Email'
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

      <div className={styles.inputContainer}>
        <div className={cx(styles.formInput, {
          [styles.focused]: focused.confirm,
          [styles.hasValue]: values.confirm,
          [styles.error]: formErrors.confirm
        })}>
          <label
            className={styles.formLabel}
            htmlFor='confirm'
          >
            Confirm password
          </label>
          <input
            className={styles.formInput}
            type='password'
            aria-label='Confirm password'
            {...register('confirm')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>
        {(formErrors.confirm != null) && <p className={styles.errorMsg}>
          {formErrors.confirm.message}
        </p>}
      </div>
    </fieldset>

    <fieldset>
      <button
        type='submit'
        className={styles.button}
      >
        {isSubmitting
          ? <LoadingIndicator dark />
          : 'Register'
        }
      </button>
    </fieldset>

    <p className={styles.privacy}>
      Will be used in accourdance with
      our <Link to='/privacy'>Privacy Policy</Link>.
    </p>

  </form>
}

export default Register
