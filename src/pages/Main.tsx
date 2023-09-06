import React, { type FC } from 'react'

const MainPage: FC = () => {
  return <section>
    <h1>mainpage</h1>

    <ul>
      <li><a href='/login'>login</a></li>
      <li><a href='/logout'>logout</a></li>
      <li><a href='/register'>register</a></li>
      <li><a href='/profile'>profile</a></li>
      <li><a href='/global-stats'>global stats</a></li>
    </ul>
  </section>
}

export default MainPage
