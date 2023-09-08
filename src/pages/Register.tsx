import React, { type FC, useState } from 'react'

import formStyles from './Form.module.sass'

const Register: FC = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
  }

  return <section>
    <h1>Register</h1>
    <form
      id='login'
      onSubmit={(event) => { void handleSubmit(event) }}
      className={formStyles.form}
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

export default Register
