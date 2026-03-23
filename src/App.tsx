import { type FC } from 'react'
import { Outlet, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import * as styles from './pages/SharedStyles.module.sass'

const App: FC = () => {
  const { pathname } = useLocation()

  return (
    <motion.div
      key={pathname}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={styles.motionDiv}
      transition={{
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99],
        type: 'Inertia',
        stiffness: 200
      }}
    >
      <Outlet />
    </motion.div>
  )
}

export default App
