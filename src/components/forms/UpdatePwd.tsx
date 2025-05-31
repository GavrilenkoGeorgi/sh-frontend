import React, { useEffect, type FC, useState, type FocusEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useUpdatePasswordMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import {
  PwdUpdateFormSchema,
  type PwdUpdateFormSchemaType
} from '../../schemas/PwdUpdateSchema'
import { ToastTypes } from '../../types'
import type {
  FocusedStates,
  InputValues,
  UpdatePwdFormErrors
} from '../../types'
import { getErrMsg } from '../../utils'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'

interface PwdUpdateProps {
  token?: string
}

const UpdatePwd: FC<PwdUpdateProps> = ({ token }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<UpdatePwdFormErrors>({})

  const [updatePassword] = useUpdatePasswordMutation()

  const {
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<PwdUpdateFormSchemaType>({
    resolver: zodResolver(PwdUpdateFormSchema)
  })

  const focusInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: true })
  }

  const blurInput = (event: FocusEvent<HTMLInputElement, Element>): void => {
    setFocused({ [event.target.name]: false })
    setValues({ ...getValues() })
    setFormErrors({ ...errors })
  }

  const onSubmit: SubmitHandler<PwdUpdateFormSchemaType> = async ({
    password,
    token
  }): Promise<void> => {
    try {
      await updatePassword({ password, token }).unwrap()
      dispatch(
        setNotification({
          msg: 'Password update ok.',
          type: ToastTypes.SUCCESS
        })
      )
      navigate('/login')
    } catch (err: unknown) {
      dispatch(
        setNotification({
          msg: getErrMsg(err),
          type: ToastTypes.ERROR
        })
      )
    }
  }

  useEffect(() => {
    if (token != null) setValue('token', token)
  }, [token])

  return (
    <form
      noValidate
      id="updatePwd"
      // https://github.com/orgs/react-hook-form/discussions/8020
      // eslint-disable-next-line
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <fieldset>
        <div className={styles.inputContainer}>
          <input
            className={styles.formInput}
            type="hidden"
            aria-label="Token"
            {...register('token')}
            onFocus={focusInput}
            onBlur={blurInput}
          />
        </div>

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.password,
              [styles.hasValue]: values.password,
              [styles.error]: formErrors.password
            })}
          >
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <input
              className={styles.formInput}
              type="password"
              aria-label="Password"
              {...register('password')}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          {formErrors.password != null && (
            <p className={styles.errorMsg}>{formErrors.password.message}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.confirm,
              [styles.hasValue]: values.confirm,
              [styles.error]: formErrors.confirm
            })}
          >
            <label className={styles.formLabel} htmlFor="confirm">
              Confirm password
            </label>
            <input
              className={styles.formInput}
              type="password"
              aria-label="Confirm password"
              {...register('confirm')}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          {formErrors.confirm != null && (
            <p className={styles.errorMsg}>{formErrors.confirm.message}</p>
          )}
        </div>

        <button type="submit" className={styles.button}>
          {isSubmitting ? <LoadingIndicator dark /> : 'Update'}
        </button>
      </fieldset>
    </form>
  )
}

export default UpdatePwd
