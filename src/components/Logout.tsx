import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../store/slices/userApiSlice'
import { logout } from '../store/slices/authSlice'

import React, { FC } from 'react'
import { RootState } from '../store'

const Logout: FC = () => {

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap()
      dispatch(logout({}))
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return <>
    <button onClick={logoutHandler}>
      Logout
    </button>
  </>

}

export default Logout
