import { type FC } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import {
  LoginFormSchema,
  type LoginFormSchemaType
} from '../../schemas/LoginFormSchema'
import {
  selectIsAuthenticated,
  setCredentials
} from '../../store/slices/authSlice'
import { useLoginMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import { ToastTypes } from '../../types'
import { getErrMsg, toPath } from '../../utils'
import { useFormFocus } from '../../hooks'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import Logout from './Logout'
import LoadingIndicator from '../layout/LoadingIndicator'
import { ROUTES } from '../../constants/routes'
import IconEye from '../../assets/svg/icon-eye.svg'
import IconEyeOff from '../../assets/svg/icon-eye-off.svg'
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility'
import { setAuthSessionHint } from '../../utils/authSessionHint'
import { useTranslation } from 'react-i18next'

const Login: FC = () => {
  const navigate = useNavigate()
  const [login] = useLoginMutation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<LoginFormSchemaType>({
    mode: 'onBlur',
    resolver: standardSchemaResolver(LoginFormSchema)
  })

  const { focused, registerWithFocus } = useFormFocus(register)
  const watchedValues = watch()
  const { isVisible, toggleVisibility, inputType } = usePasswordVisibility()

  const onSubmit: SubmitHandler<LoginFormSchemaType> = async ({
    email,
    password
  }): Promise<void> => {
    try {
      const user = await login({ email, password }).unwrap()
      setAuthSessionHint()
      dispatch(setCredentials({ user }))
      navigate(toPath(ROUTES.PLAY), { viewTransition: true })
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
      onSubmit={handleSubmit(onSubmit)}
      id="login"
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

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.password,
              [styles.hasValue]: watchedValues.password,
              [styles.error]: errors.password
            })}
          >
            <label htmlFor="password" className={styles.formLabel}>
              {t('ui.inputLabels.password')}
            </label>
            <div className={styles.passwordInputWrap}>
              <input
                className={styles.formInput}
                type={inputType}
                aria-label={t('ui.inputLabels.password')}
                {...registerWithFocus('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={toggleVisibility}
                aria-label={
                  isVisible
                    ? t('ui.inputLabels.hidePassword')
                    : t('ui.inputLabels.showPassword')
                }
                aria-pressed={isVisible}
              >
                {isVisible ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>
          {errors.password != null && (
            <p className={styles.errorMsg}>{errors.password.message}</p>
          )}
        </div>
        <div className={styles.buttons}>
          <button
            type="submit"
            disabled={isSubmitting || isAuthenticated}
            className={styles.button}
          >
            {isSubmitting ? (
              <LoadingIndicator dark />
            ) : (
              t('ui.buttonLabels.login')
            )}
          </button>
          <Logout />
        </div>
      </fieldset>
    </form>
  )
}

export default Login
