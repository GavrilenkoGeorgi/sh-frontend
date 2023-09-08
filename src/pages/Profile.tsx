import React, { type FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '../store'
import { useUpdateUserMutation } from '../store/slices/userApiSlice'
import { setCredentials } from '../store/slices/authSlice'

import LoadingNotification from '../components/LoadingNotification'

import styles from './Login.module.sass'

const Profile: FC = () => {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const [updateProfile, { isLoading }] = useUpdateUserMutation()

  useEffect(() => {
    if (userInfo != null) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo?.email, userInfo?.name])

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()

    if (password !== confirmPassword) {
      console.error('Passwords do not match')
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo?._id,
          name,
          email,
          password
        }).unwrap()
        console.log(res)
        dispatch(setCredentials(res))
        // toast.success('Profile updated successfully')
      } catch (err) {
        // toast.error(err?.data?.message || err.error)
        console.log(err)
      }
    }
  }

  return <section>
    <h1>Profile</h1>
      {isLoading && <LoadingNotification />}
    <form
      id='login'
      onSubmit={(event) => { void handleSubmit(event) }}
      className={styles.form}
    >
      <input
        type='name'
        placeholder='name'
        name='name'
        value={name}
        onChange={(e) => { setName(e.target.value) }}
      />
      <input
        type='email'
        placeholder='email'
        name='email'
        value={email}
        onChange={(e) => { setEmail(e.target.value) }}
      />
      <input
        type='password'
        placeholder='password'
        name='password'
        value={password}
        onChange={(e) => { setPassword(e.target.value) }}
      />
      <input
        type='password'
        placeholder='confirm password'
        name='consfirmPassword'
        value={confirmPassword}
        onChange={(e) => { setConfirmPassword(e.target.value) }}
      />
      <button type='submit'>Update</button>
    </form>
  </section>
}

export default Profile
