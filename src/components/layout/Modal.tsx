import React, { type FC } from 'react'
import { Link } from 'react-router-dom'
import type { Nullable } from '../../types'

import LoadingIndicator from './LoadingIndicator'
import styles from './Modal.module.sass'

interface ModalProps {
  heading: string
  text: string
  btnLabel: string
  onClick: () => void
  score?: number
  userName?: Nullable<string>
  isDisabled?: boolean
}

const Modal: FC<ModalProps> = ({ heading, text, btnLabel, isDisabled, onClick, score, userName }) => {

  return <div className={styles.modal}>
    <div className={styles.blur}></div>
    <div className={styles.message}>
      <h2>{heading}</h2>
      <p>{text} {score}</p>
        <button onClick={onClick} disabled={isDisabled}>
          {isDisabled !== false
            ? <LoadingIndicator />
            : `${btnLabel}`
          }
        </button>
        {userName == null && <Link
          to='/register'
          className={styles.link}
          >
            Register to save results and view stats
          </Link>
        }
    </div>
  </div>

}

export default Modal
