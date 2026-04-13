import React, { type FC } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useDispatch } from 'react-redux'

import {
  RecoveryEmailSchema,
  type RecoveryEmailSchemaType
} from '../../schemas/RecoveryEmailSchema'
import { useSendRecoveryEmailMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'
import { getErrMsg } from '../../utils'
import { useFormFocus } from '../../hooks'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import { useTranslation } from 'react-i18next'

const ForgotPwd: FC = () => {
  const [sendRecoveryEmail] = useSendRecoveryEmailMutation()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<RecoveryEmailSchemaType>({
    mode: 'onBlur',
    resolver: standardSchemaResolver(RecoveryEmailSchema)
  })

  const { focused, registerWithFocus } = useFormFocus(register)
  const watchedValues = watch()

  const onSubmit: SubmitHandler<RecoveryEmailSchemaType> = async ({
    email
  }): Promise<void> => {
    try {
      await sendRecoveryEmail({ email })
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.recoveryEmailSent'),
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
              [styles.hasValue]: watchedValues.email,
              [styles.error]: errors.email
            })}
          >
            <label className={styles.formLabel} htmlFor="email">
              {t('ui.inputLabels.email')}
            </label>
            <input
              id="email"
              className={styles.formInput}
              aria-label={t('ui.inputLabels.email')}
              type="email"
              {...registerWithFocus('email')}
              autoComplete="email"
            />
          </div>
          {errors.email != null && (
            <p className={styles.errorMsg}>{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? (
            <LoadingIndicator dark />
          ) : (
            t('ui.buttonLabels.sendEmail')
          )}
        </button>
      </fieldset>
    </form>
  )
}

export default ForgotPwd
