import React, { type FC } from 'react'
import { Link } from 'react-router-dom'

const MainPage: FC = () => {
  return <section>
    <h1>mainpage</h1>

    <ul>
      <li><Link to='/login'>login</Link></li>
      <li><Link to='/logout'>logout</Link></li>
      <li><Link to='/register'>register</Link></li>
      <li><Link to='/profile'>profile</Link></li>
      <li><Link to='/global-stats'>global stats</Link></li>
    </ul>
  </section>
}

export default MainPage
