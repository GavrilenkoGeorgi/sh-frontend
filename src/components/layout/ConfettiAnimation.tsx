import { useEffect, type FC } from 'react'
import { useConfetti } from 'use-confetti-svg'

const ConfettiAnimation: FC = () => {

  const { runAnimation } = useConfetti({
    images: [
      {
        src: '/img/star.svg',
        size: 24,
        weight: 2
      },
      {
        src: '/img/square.svg',
        size: 10,
        weight: 4
      },
      {
        src: '/img/circle.svg',
        size: 12,
        weight: 2
      },
      {
        src: '/img/confetti-ribbon.svg',
        size: 60,
        weight: 5
      }
    ],
    rotate: true,
    particleCount: 50,
    duration: 4000,
    fadeOut: 2000
  })

  useEffect(() => {
    void runAnimation()
  }, [])

  return null
}

export default ConfettiAnimation
