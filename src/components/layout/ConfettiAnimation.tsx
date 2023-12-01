import { useEffect, type FC } from 'react'
import { useConfetti } from 'use-confetti-svg'

const ConfettiAnimation: FC = () => {

  const { runAnimation } = useConfetti({
    images: [
      {
        src: '/img/confetti-ribbon.svg',
        size: 66,
        weight: 5
      },
      {
        src: '/img/star.svg',
        size: 20,
        weight: 3
      }
    ],
    rotate: true,
    particleCount: 50,
    duration: 3000,
    fadeOut: 2000
  })

  useEffect(() => {
    void runAnimation()
  }, [])

  return null
}

export default ConfettiAnimation
