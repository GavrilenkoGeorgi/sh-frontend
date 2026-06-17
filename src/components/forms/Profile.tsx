import { type FC } from 'react'
import { useDispatch } from 'react-redux'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { setNotification } from '../../store/slices/notificationSlice'
import {
  ProfileFormSchema,
  type ProfileFormSchemaType
} from '../../schemas/ProfileFormSchema'
import { ToastTypes } from '../../types'
import type { User, Nullable } from '../../types'

import { useFormFocus } from '../../hooks'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import { useUpdateProfileMutation } from '../../store/api/userApi'
import Logout from './Logout'
import { useTranslation } from 'react-i18next'
import { Button } from '../layout/Button/BaseButton'
import { ProfileLinks } from '../../pages/Profile'

interface Props {
  data: Nullable<User>
}
const Profile: FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const [updateProfile] = useUpdateProfileMutation()
  const { t } = useTranslation()

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<ProfileFormSchemaType>({
    mode: 'onBlur',
    resolver: standardSchemaResolver(ProfileFormSchema),
    defaultValues: {
      name: data?.name ?? '',
      email: data?.email ?? ''
    }
  })

  const { focused, registerWithFocus } = useFormFocus(register)
  const watchedValues = watch()

  const onSubmit: SubmitHandler<ProfileFormSchemaType> = async ({
    name,
    email
  }): Promise<void> => {
    try {
      const update = {
        id: data?._id,
        name,
        email
      }
      await updateProfile(update).unwrap()
      dispatch(
        setNotification({
          msg: t('ui.toastMessages.profileUpdated'),
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
      id="updateProfile"
      onSubmit={handleSubmit(onSubmit)}
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
            <label className={styles.formLabel} htmlFor="name">
              {t('ui.inputLabels.name')}
            </label>
            <input
              className={styles.formInput}
              type="text"
              aria-label={t('ui.inputLabels.name')}
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
              {t('ui.inputLabels.email')}
            </label>
            <input
              className={styles.formInput}
              type="email"
              aria-label={t('ui.inputLabels.email')}
              {...registerWithFocus('email')}
              autoComplete="email"
            />
          </div>
          {errors.email != null && (
            <p className={styles.errorMsg}>{errors.email.message}</p>
          )}
        </div>
      </fieldset>
      <Button type="submit" isLoading={isSubmitting}>
        {t('ui.buttonLabels.update')}
      </Button>
      <p style={{ textAlign: 'center' }}>or</p>
      <Logout />
      <ProfileLinks />
    </form>
  )
}

export default Profile
