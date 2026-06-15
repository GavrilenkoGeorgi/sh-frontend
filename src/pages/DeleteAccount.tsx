import { type FC } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/slices/authSlice'
import DeleteAccountForm from '../components/forms/DeleteAccount'
import * as styles from './SharedStyles.module.sass'
import { Trans, useTranslation } from 'react-i18next'

const DeleteAccount: FC = () => {
  const { t } = useTranslation()
  const user = useSelector(selectCurrentUser)

  return (
    <section className={styles.contentPage}>
      <h1 className={styles.pageHeading}>{t('pages.deleteAccount.heading')}</h1>
      <h2>{t('pages.deleteAccount.subHeading')}</h2>
      <p>
        <Trans i18nKey="pages.deleteAccount.intro">
          To delete your account and associated data from Sharlushka Dice Game,
          follow these steps:
        </Trans>
      </p>

      <p>
        <Trans i18nKey="pages.deleteAccount.intitateDeletion">
          <strong>1. Initiate Deletion:</strong> Log in to your account,
          navigate to the profile page and click the &apos;Delete Account&apos;
          link.
        </Trans>
      </p>

      <p>
        <Trans i18nKey="pages.deleteAccount.confirmation">
          <strong>2. Confirmation:</strong> Confirm your decision to delete the
          account. Please note that this action is irreversible.
        </Trans>
      </p>

      <p>
        <Trans i18nKey="pages.deleteAccount.dataRemoval.title">
          <strong>3. Data Removal:</strong>
        </Trans>
      </p>

      <ul>
        <li>
          <Trans i18nKey="pages.deleteAccount.dataRemoval.accountInfo">
            <strong>Account Information:</strong> Your account details,
            including name and email, will be permanently deleted.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="pages.deleteAccount.dataRemoval.gameResults">
            <strong>Game Results:</strong> All associated game results will be
            removed from our system.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="pages.deleteAccount.dataRemoval.accessTokens">
            <strong>Access Tokens:</strong> Any access tokens related to your
            account will be invalidated.
          </Trans>
        </li>
        <li>
          <Trans i18nKey="pages.deleteAccount.dataRemoval.completion">
            <strong>Completion:</strong> Once the deletion process is complete,
            you will receive a confirmation notification.
          </Trans>
        </li>
      </ul>

      <p>
        <Trans i18nKey="pages.deleteAccount.contact">
          For any questions or assistance regarding account deletion, contact us
          at
          <a href="mailto:sharlushka.game@gmail.com">
            sharlushka.game@gmail.com
          </a>
          .
        </Trans>
      </p>
      {user != null && <DeleteAccountForm />}
    </section>
  )
}

export default DeleteAccount
