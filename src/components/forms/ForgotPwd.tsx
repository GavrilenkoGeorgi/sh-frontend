import { type FC } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useDispatch } from 'react-redux'

import {
  RecoveryEmailSchema,
  type RecoveryEmailSchemaType
} from '../../schemas/RecoveryEmailSchema'
import { useSendRecoveryEmailMutation } from '../../store/api/userApi'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'
import { useFormFocus } from '../../hooks'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import { useTranslation } from 'react-i18next'
import { Button } from '../layout/Button/BaseButton'

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
    } catch {
      // error toast is handled centrally in baseQueryWithReauth
    }
  }

  return (
    <form
      noValidate
      autoComplete="off"
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

        <Button type="submit" isLoading={isSubmitting}>
          {t('ui.buttonLabels.sendEmail')}
        </Button>
      </fieldset>
    </form>
  )
}

export default ForgotPwd
