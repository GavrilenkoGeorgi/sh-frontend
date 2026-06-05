import i18n from '../../i18n'
import { ToastTypes } from '../../types'
import { rollDice, markSchoolFailedNotified } from '../slices/shSlice'
import { setNotification } from '../slices/notificationSlice'
import { startAppListening } from './listenerMiddleware'

// dispatch the school-failed toast once when the game ends due to a failed school phase
startAppListening({
  actionCreator: rollDice,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState()
    const { game } = state.sh

    if (game.over && !game.schoolFailedNotified) {
      listenerApi.dispatch(
        setNotification({
          msg: i18n.t('ui.toastMessages.schoolFailed'),
          type: ToastTypes.ERROR,
          autoClose: false
        })
      )
      listenerApi.dispatch(markSchoolFailedNotified())
    }
  }
})
