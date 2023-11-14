import React, { type FC } from 'react'

import styles from './Modal.module.sass'

interface ModalProps {
  heading: string
  text: string
  btnLabel: string
  onClick: () => void
  score?: number
}

const Modal: FC<ModalProps> = ({ heading, text, btnLabel, onClick, score }) => {

  return <div className={styles.modal}>
    <div className={styles.blur}></div>
    <div className={styles.message}>
      <h2>{heading}</h2>
      <p>{text}{score != null ? ` ${score}` : null}</p>
      <button onClick={onClick}>
        {btnLabel}
      </button>
    </div>
  </div>

}

export default Modal
