import React, { type FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux/es/exports'

import { setCredentials } from '../store/slices/authSlice'
import { useLoginMutation } from '../store/slices/userApiSlice'

import LoadingNotification from '../components/LoadingNotification'
import styles from './Login.module.sass'

const Login: FC = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()

    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate('/')
    } catch (err: any) {
      // console.log(err.data.message || err.error) /!
      console.log(err)
    }
  }

  return <section className={styles.container}>
    <h1>login</h1>
    {isLoading && <LoadingNotification />}
    <form
      id='login'
      onSubmit={(event) => { void handleSubmit(event) }}
      className={styles.form}
    >
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
      <button type='submit'>login</button>
    </form>

  </section>
}

export default Login
