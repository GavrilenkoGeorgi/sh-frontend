import { type FC, useState, type FocusEvent } from 'react'
import { useDispatch } from 'react-redux'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { setNotification } from '../../store/slices/notificationSlice'
import {
  ProfileFormSchema,
  type ProfileFormSchemaType
} from '../../schemas/ProfileFormSchema'
import { ToastTypes } from '../../types'
import type { User, Nullable, FocusedStates } from '../../types'
import { getErrMsg } from '../../utils'

import cx from 'classnames'
import * as styles from './Form.module.sass'
import LoadingIndicator from '../layout/LoadingIndicator'
import { useUpdateProfileMutation } from '../../store/slices/userApiSlice'

interface Props {
  data: Nullable<User>
}
const Profile: FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const [updateProfile] = useUpdateProfileMutation()
  const [focused, setFocused] = useState<FocusedStates>({})

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

  const watchedValues = watch()

  const registerWithFocus = (name: keyof ProfileFormSchemaType) => {
    const { onBlur, ...rest } = register(name)
    return {
      ...rest,
      onFocus: (event: FocusEvent<HTMLInputElement, Element>) => {
        setFocused({ [event.target.name]: true })
      },
      onBlur: (event: FocusEvent<HTMLInputElement, Element>) => {
        setFocused({ [event.target.name]: false })
        void onBlur(event)
      }
    }
  }

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
          msg: 'Profile update ok.',
          type: ToastTypes.SUCCESS
        })
      )
      // TODO: decide what to do next
      // need to update the user data in store
      // to refill the form with new values and other places this data is used
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
              Name
            </label>
            <input
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

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? <LoadingIndicator dark /> : 'Update'}
        </button>
      </fieldset>
    </form>
  )
}

export default Profile
