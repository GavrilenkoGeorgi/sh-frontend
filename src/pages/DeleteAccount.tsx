import React, { type FC } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import DeleteAccountForm from '../components/forms/DeleteAccount'
import * as styles from './SharedStyles.module.sass'

const DeleteAccount: FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)

  return (
    <section className={styles.container}>
      <h1 className={styles.pageHeading}>Delete account</h1>
      <h2>Account Deletion Process</h2>
      <p>
        To delete your account and associated data from Sharlushka Dice Game,
        follow these steps:
      </p>

      <p>
        <strong>1. Initiate Deletion:</strong> Log in to your account, navigate
        to the profile page and click the &apos;Delete Account&apos; link.
      </p>

      <p>
        <strong>2. Confirmation:</strong> Confirm your decision to delete the
        account. Please note that this action is irreversible.
      </p>

      <p>
        <strong>3. Data Removal:</strong>
      </p>
      <ul>
        <li>
          <strong>Account Information:</strong> Your account details, including
          name and email, will be permanently deleted.
        </li>
        <li>
          <strong>Game Results:</strong> All associated game results will be
          removed from our system.
        </li>
        <li>
          <strong>Access Tokens:</strong> Any access tokens related to your
          account will be invalidated.
        </li>
        <li>
          <strong>Completion:</strong> Once the deletion process is complete,
          you will receive a confirmation notification.
        </li>
      </ul>
      <p>
        For any questions or assistance regarding account deletion, contact us
        at{' '}
        <a href="mailto:gavrilenko.georgi@gmail.com">
          gavrilenko.georgi@gmail.com
        </a>
        .
      </p>
      {userInfo != null && <DeleteAccountForm />}
    </section>
  )
}

export default DeleteAccount
