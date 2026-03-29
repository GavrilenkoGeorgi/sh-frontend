import { useSelector, useDispatch } from 'react-redux'
import {
  selectHasSeenGameTour,
  markGameTourSeen,
  resetGameTour
} from '../store/slices/tourSlice'

export const useGameTour = () => {
  const dispatch = useDispatch()
  const hasSeenGameTour = useSelector(selectHasSeenGameTour)

  return {
    hasSeenGameTour,
    markGameTourSeen: () => dispatch(markGameTourSeen()),
    startGameTour: () => dispatch(resetGameTour()),
    resetGameTour: () => dispatch(resetGameTour())
  }
}
