import { type FC } from 'react'
import { useDispatch } from 'react-redux'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useNavigate, Link } from 'react-router'
import cx from 'classnames'

import { useSignupMutation } from '../../store/slices/userApiSlice'
import { setNotification } from '../../store/slices/notificationSlice'
import {
  RegisterFormSchema,
  type RegisterFormSchemaType
} from '../../schemas/RegisterFormSchema'
import { ToastTypes } from '../../types'
import { getErrMsg, toPath } from '../../utils'
import { useFormFocus } from '../../hooks'

import LoadingIndicator from '../layout/LoadingIndicator'
import * as styles from './Form.module.sass'
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility'
import { ROUTES } from '../../constants/routes'
import IconEye from '../../assets/svg/icon-eye.svg'
import IconEyeOff from '../../assets/svg/icon-eye-off.svg'

const Register: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [signup] = useSignupMutation()

  const passwordVisibility = usePasswordVisibility()
  const confirmPasswordVisibility = usePasswordVisibility()

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<RegisterFormSchemaType>({
    mode: 'onBlur',
    resolver: standardSchemaResolver(RegisterFormSchema)
  })

  const { focused, registerWithFocus } = useFormFocus(register)
  const watchedValues = watch()

  const onSubmit: SubmitHandler<RegisterFormSchemaType> = async (
    data
  ): Promise<void> => {
    try {
      await signup(data).unwrap()
      dispatch(
        setNotification({
          msg: 'All ok, you can login after activating your account.',
          type: ToastTypes.SUCCESS
        })
      )
      navigate(toPath(ROUTES.LOGIN), { replace: true, viewTransition: true })
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
      onSubmit={handleSubmit(onSubmit)}
      id="register"
      className={styles.form}
    >
      <fieldset>
        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.name,
              [styles.hasValue]: watchedValues.name,
              [styles.error]: errors.name
            })}
          >
            <label htmlFor="name" className={styles.formLabel}>
              Name
            </label>
            <input
              id="name"
              className={styles.formInput}
              type="text"
              aria-label="Name"
              {...registerWithFocus('name')}
              autoComplete="name"
            />
          </div>
          {errors.name != null && (
            <p className={styles.errorMsg}>{errors.name.message}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <div
            className={cx(styles.formInput, {
              [styles.focused]: focused.email,
              [styles.hasValue]: watchedValues.email,
              [styles.error]: errors.email
            })}
          >
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.formInput}
              type="email"
              aria-label="Email"
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
              Password
            </label>
            <div className={styles.passwordInputWrap}>
              <input
                id="password"
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
            <input
              id="confirm"
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
          {errors.confirm != null && (
            <p className={styles.errorMsg}>{errors.confirm.message}</p>
          )}
        </div>
      </fieldset>

      <fieldset>
        <button type="submit" className={styles.button}>
          {isSubmitting ? <LoadingIndicator dark /> : 'Register'}
        </button>
      </fieldset>

      <p className={styles.privacy}>
        Will be used in accourdance with our{' '}
        <Link to={toPath(ROUTES.PRIVACY)} viewTransition>
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

export default Register
