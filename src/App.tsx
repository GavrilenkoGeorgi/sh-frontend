import { type FC } from 'react'
import { Outlet } from 'react-router'
import * as styles from './pages/SharedStyles.module.sass'

const App: FC = () => {
  return (
    <div className={styles.motionDiv}>
      <Outlet />
    </div>
  )
}

export default App
