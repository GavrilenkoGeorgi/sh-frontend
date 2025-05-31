import React, { type FC } from 'react'
import * as styles from './SharedStyles.module.sass'

const Privacy: FC = () => {
  return (
    <section className={styles.container}>
      <h1>Privacy Policy for Sharlushka Dice Game</h1>
      <p className={styles.dateStamp}>Last updated: 13.12.2023</p>
      <article>
        <p>
          Thank you for choosing to use Sharlushka Dice Game (&apos;us&apos;,
          &apos;we&apos;, or &apos;our&apos;). We are committed to protecting
          your personal information and your right to privacy. If you have any
          questions or concerns about our policy or practices with regards to
          your personal information, please contact us at{' '}
          <a href="mailto:gavrilenko.georgi@gmail.com">
            gavrilenko.georgi@gmail.com
          </a>
          . By using the Sharlushka Dice Game, you agree to the terms of this
          privacy policy. Please take the time to read through the following
          information.
        </p>
        <h2>Information We Collect</h2>
        <p>
          1. Personal Information <br />
          To provide you with access to certain features of the game and to
          enable you to save your results, we may collect the following personal
          information:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
        </ul>
        <p>
          2. Automatically Collected Information <br />
          In addition to the personal information listed above, we may also
          collect certain information automatically when you use our
          application. This may include your device&apos;s IP address, operating
          system, browser type, and other technical information.
        </p>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To create and manage user accounts.</li>
          <li>To provide and maintain our services.</li>
          <li>To improve and personalize user experience.</li>
          <li>
            To communicate with users about their accounts and provide customer
            support.
          </li>
          <li>
            To monitor the usage of our services and detect, prevent, and
            address technical issues.
          </li>
        </ul>
        <h2>Sharing Your Information</h2>
        <p>
          We do not sell or share your personal information with third parties
          except as described in this privacy policy.
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access or disclosure. However, no method of transmission
          over the internet or electronic storage is completely secure, so we
          cannot guarantee absolute security.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. Any changes will
          be posted on this page with an updated date. It is your responsibility
          to check this page periodically for changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us
          at{' '}
          <a href="mailto:gavrilenko.georgi@gmail.com">
            gavrilenko.georgi@gmail.com
          </a>
          .
        </p>
      </article>
    </section>
  )
}

export default Privacy
