import { useEffect, type FC } from 'react'
import { useDispatch } from 'react-redux'
import LoadingIndicator from './LoadingIndicator'
import {
  loaderMounted,
  loaderUnmounted
} from '../../store/slices/swUpdateSlice'

import * as styles from './Fallback.module.sass'

const Fallback: FC = () => {
  const dispatch = useDispatch()

  // tracks this loader's lifetime so the app-wide update can wait for it to clear
  useEffect(() => {
    dispatch(loaderMounted())
    return () => {
      dispatch(loaderUnmounted())
    }
  }, [dispatch])

  return (
    <div className={styles.layout}>
      <LoadingIndicator dark large />
    </div>
  )
}

export default Fallback
