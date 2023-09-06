import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux/es/exports'

import { RootState } from '../store'
import { setCredentials } from '../store/slices/authSlice'
import { useLoginMutation } from '../store/slices/userApiSlice'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate('/')
    } catch (err: any) {
      console.log(err.data.message || err.error)
    }
  }

  return <section>
    <h1>login</h1>
    <form id='login' onSubmit={(event) => handleSubmit(event)}>
      <input
        type='email'
        placeholder='email'
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        name='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type='submit'>login</button>
    </form>

  </section>
}

export default Login
