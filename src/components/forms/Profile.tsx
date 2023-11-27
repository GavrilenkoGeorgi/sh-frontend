import React, { type FC, useState, useEffect, type FocusEvent } from 'react'
import { useDispatch } from 'react-redux'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useUpdateUserMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { RegisterFormSchema, type RegisterFormSchemaType } from '../../schemas/RegisterFormSchema'
import { ToastTypes } from '../../types'
import type { IUser, Nullable, FocusedStates, InputValues, RegisterFormErrors } from '../../types'
import { getErrMsg } from '../../utils'

import cx from 'classnames'
import styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'

interface iProps {
  data: Nullable<IUser>
}
const Profile: FC<iProps> = ({ data }) => {

  const dispatch = useDispatch()
  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({})

  const [updateProfile] = useUpdateUserMutation()

  const { register, getValues, setValue, formState: { errors, isSubmitting }, handleSubmit } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema)
  })

  const focusInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: true })
  }

  const blurInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: false })
    setValues({ ...getValues() })
    setFormErrors({ ...errors })
  }

  useEffect(() => {
    if (data !== null) {
      setFocused({ name: true })
      setValue('email', data.email)
      setValue('name', data.name)
      setValues({ ...data })
    }
  }, [])

  const onSubmit: SubmitHandler<RegisterFormSchemaType> = async ({ name, email, password, confirm }): Promise<void> => {
    try {
      if (password !== confirm) {
        throw new Error('Passwords do not match.')
      }
      const update = {
        id: data?._id,
        name,
        email,
        password
      }
      await updateProfile(update).unwrap()
      dispatch(setNotification({
        msg: 'Profile update ok.',
        type: ToastTypes.SUCCESS
      }))
    } catch (err: unknown) {
      dispatch(setNotification({
        msg: getErrMsg(err),
        type: ToastTypes.ERROR
      }))
    }
  }

  return <form
    noValidate
    id='register'
    // https://github.com/orgs/react-hook-form/discussions/8020
    // eslint-disable-next-line
    onSubmit={handleSubmit(onSubmit)}
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
            className={styles.formLabel}
            htmlFor='name'
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
      <button type='submit'>
        {isSubmitting
          ? <LoadingIndicator dark />
          : 'Update'
        }
      </button>
    </fieldset>
  </form>
}

export default Profile
