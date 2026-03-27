import React, { useEffect, type FC } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { useUpdatePasswordMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import {
  PwdUpdateFormSchema,
  type PwdUpdateFormSchemaType
} from '../../schemas/PwdUpdateSchema'
import { ToastTypes } from '../../types'
import { getErrMsg } from '../../utils'
import { useFormFocus } from '../../hooks'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import { ROUTES } from '../../constants/routes'
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility'
import IconEye from '../../assets/svg/icon-eye.svg'
import IconEyeOff from '../../assets/svg/icon-eye-off.svg'

interface PwdUpdateProps {
  token?: string
}

const UpdatePwd: FC<PwdUpdateProps> = ({ token }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [updatePassword] = useUpdatePasswordMutation()

  const passwordVisibility = usePasswordVisibility()
  const confirmPasswordVisibility = usePasswordVisibility()

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<PwdUpdateFormSchemaType>({
    mode: 'onBlur',
    resolver: standardSchemaResolver(PwdUpdateFormSchema)
  })

  const { focused, registerWithFocus } = useFormFocus(register)
  const watchedValues = watch()

  const onSubmit: SubmitHandler<PwdUpdateFormSchemaType> = async ({
    password,
    confirm,
    token
  }): Promise<void> => {
    try {
      await updatePassword({ password, confirm, token }).unwrap()
      dispatch(
        setNotification({
          msg: 'Password update ok.',
          type: ToastTypes.SUCCESS
        })
      )
      navigate(ROUTES.LOGIN, { viewTransition: true })
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
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <fieldset>
        <div className={styles.inputContainer}>
          <input
            className={styles.formInput}
            type="hidden"
            aria-label="Token"
            {...registerWithFocus('token')}
            autoComplete="off"
          />
        </div>

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.password,
              [styles.hasValue]: watchedValues.password,
              [styles.error]: errors.password
            })}
          >
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordInputWrap}>
              <input
                className={styles.formInput}
                type={passwordVisibility.inputType}
                aria-label="Password"
                {...registerWithFocus('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={passwordVisibility.toggleVisibility}
                aria-label={
                  passwordVisibility.isVisible
                    ? 'Hide password'
                    : 'Show password'
                }
                aria-pressed={passwordVisibility.isVisible}
              >
                {passwordVisibility.isVisible ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          {errors.password != null && (
            <p className={styles.errorMsg}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.confirm,
              [styles.hasValue]: watchedValues.confirm,
              [styles.error]: errors.confirm
            })}
          >
            <label className={styles.formLabel} htmlFor="confirm">
              Confirm password
            </label>
            <div className={styles.passwordInputWrap}>
              <input
                className={styles.formInput}
                type={confirmPasswordVisibility.inputType}
                aria-label="Confirm password"
                {...registerWithFocus('confirm')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={confirmPasswordVisibility.toggleVisibility}
                aria-label={
                  confirmPasswordVisibility.isVisible
                    ? 'Hide password'
                    : 'Show password'
                }
                aria-pressed={confirmPasswordVisibility.isVisible}
              >
                {confirmPasswordVisibility.isVisible ? (
                  <IconEyeOff />
                ) : (
                  <IconEye />
                )}
              </button>
            </div>
          </div>
          {errors.confirm != null && (
            <p className={styles.errorMsg}>{errors.confirm.message}</p>
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
