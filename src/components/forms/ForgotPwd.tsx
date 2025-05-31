import React, { type FC, useState, type FocusEvent } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'

import {
  RecoveryEmailSchema,
  type RecoveryEmailSchemaType
} from '../../schemas/RecoveryEmailSchema'
import { useSendRecoveryEmailMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'
import type { FocusedStates, InputValues, LoginFormErrors } from '../../types'
import { getErrMsg } from '../../utils'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'

const ForgotPwd: FC = () => {
  const [sendRecoveryEmail] = useSendRecoveryEmailMutation()

  const dispatch = useDispatch()

  const [focused, setFocused] = useState<FocusedStates>({})
  const [values, setValues] = useState<InputValues>({})
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({})

  const {
    register,
    getValues,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<RecoveryEmailSchemaType>({
    resolver: zodResolver(RecoveryEmailSchema)
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

  const onSubmit: SubmitHandler<RecoveryEmailSchemaType> = async ({
    email
  }): Promise<void> => {
    try {
      await sendRecoveryEmail({ email })
      dispatch(
        setNotification({
          msg: 'Recovery email sent, check your inbox.',
          type: ToastTypes.SUCCESS
        })
      )
    } catch (err: unknown) {
      dispatch(
        setNotification({
          msg: getErrMsg(err),
          type: ToastTypes.ERROR
        })
      )
    }
  }

  return (
    <form
      noValidate
      autoComplete="off"
      // eslint-disable-next-line
      onSubmit={handleSubmit(onSubmit)}
      id="forgotPwd"
      className={styles.form}
    >
      <fieldset>
        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.email,
              [styles.hasValue]: values.email,
              [styles.error]: formErrors.email
            })}
          >
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              className={styles.formInput}
              aria-label="Email"
              type="email"
              {...register('email')}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          {formErrors.email != null && (
            <p className={styles.errorMsg}>{formErrors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? <LoadingIndicator dark /> : 'Send email'}
        </button>
      </fieldset>
    </form>
  )
}

export default ForgotPwd
