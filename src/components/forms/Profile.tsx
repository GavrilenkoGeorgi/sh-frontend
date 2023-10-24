import React, { type FC, useState, useEffect, type FocusEvent } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import type { IUser, Nullable, FocusedStates, InputValues, RegisterFormErrors } from '../../types'
import { useUpdateUserMutation } from '../../store/slices/userApiSlice'

import { RegisterFormSchema, type RegisterFormSchemaType } from '../../schemas/RegisterFormSchema'

import cx from 'classnames'
import styles from './Form.module.sass'
import LoadingNotification from '../LoadingNotification'

interface iProps {
  data: Nullable<IUser>
}
const Profile: FC<iProps> = ({ data }) => {

  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({})

  const [updateProfile, { isLoading }] = useUpdateUserMutation()

  const { register, getValues, setValue, formState: { errors }, handleSubmit } = useForm<RegisterFormSchemaType>({
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
    } catch (err) {
      console.log(err)
    } finally {
      console.log('Update ok.')
    }
  }

  return <form
    noValidate
    id='register'
    // eslint-disable-next-line
    onSubmit={handleSubmit(onSubmit)}
    className={styles.form}
  >
    {isLoading && <LoadingNotification />}
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
            type='text'
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
            {...register('confirm')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>
        {(formErrors.confirm != null) && <p className={styles.errorMsg}>
          {formErrors.confirm.message}
        </p>}
      </div>
      <button type='submit'>Update</button>
    </fieldset>
  </form>
}

export default Profile
