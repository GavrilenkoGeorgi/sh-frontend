import { type iCombination } from '../types'

class ShScore {

  combination: iCombination

  constructor () {
    this.combination = {
      pair: 0,
      twoPairs: 0,
      triple: 0,
      full: 0,
      quads: 0,
      poker: 0,
      small: 0,
      large: 0,
      chance: 0
    }
  }

  // Roll dice
  rollDice = (): number[] => {
    const minValue = 1
    const maxValue = 6
    const currentScore = Array.apply(null, Array(5))
      .map(() => this.getRandomInt(minValue, maxValue))

    return currentScore.sort((a, b) => { return a - b })
  }

  // Return current state of the score object
  getScore = (values: number[]): iCombination => {
    this.reset()
    this.calcScore(values)
    return this.combination
  }

  // Get random value for the dice
  private readonly getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // Check if array is ascending ('small' and 'large' combinations require this)
  private readonly isAscending = (arr: number[]): boolean => {
    return arr.every(function (item, index) {
      return index === 0 || item - 1 === arr[index - 1]
    })
  }

  // Reset combination object
  private readonly reset = (): void => {
    for (const key in this.combination) {
      this.combination[key as keyof typeof this.combination] = 0
    }
  }

  // Calc score for given combination
  private readonly calcScore = (latestTurn: number[]): void => {
    // it needs to be in ascending order
    // [ 1, 2, 3, 4, 5 ]
    // usually something like this:
    // [ 1, 3, 5, 6, 6 ]

    // this one is from the outside and used everywhere
    const [firstValue] = latestTurn

    // two dimensional array to store score values
    // length is 6 as the values range from 1 to 6
    const valuesArray: number[][] = [[], [], [], [], [], []]

    // combine same values into 2D array
    for (const score of latestTurn) {
      // using value as index
      valuesArray[score - 1].push(score)
    }

    // poker, small and large combinations are checked separately
    // as they look like some kind of an 'edge case'
    // check for 'poker' (the simpliest one)
    const poker = latestTurn.every(value => { return value === firstValue })
    if (poker) {
      this.combination.poker = firstValue * 5
    }

    // check for 'small/large'
    if (this.isAscending(latestTurn)) {
      for (const item of latestTurn) {
        // if first value is 1 it's a 'small' else 'large'
        if (firstValue === 1) this.combination.small = this.combination.small += item
        else this.combination.large = this.combination.large += item
      }
    }

    // length based checks
    // iterate values of an array and figure out scores
    for (const item of valuesArray) {
      const [value] = item
      // check for pair and two pairs
      if (item.length >= 2) {
        // check if we already have value
        if (this.combination.pair !== 0) { // not zero i.e., exists
          // check if the new value is bigger
          const currentValue = this.combination.pair
          const secondPairValue = value * 2
          if (secondPairValue > currentValue) {
            this.combination.pair = secondPairValue
          }
          // set two pairs score
          this.combination.twoPairs = currentValue + secondPairValue
        } else this.combination.pair = value * 2 // value was null, set one pair score
      }

      // check for triple
      if (item.length >= 3) {
        this.combination.triple = value * 3
      }

      // check for quads
      if (item.length >= 4) {
        this.combination.quads = value * 4
      }

      // check for full
      // we can use the pairs and triple values
      // this one is tricky
      // if 'triple' value is bigger that 'pair'
      // it is recorder as a higher 'pair' but we can't use it
      // as it is a part of triple and we need original other pair
      // although it may be smaller
      if ((this.combination.triple !== 0) && (this.combination.twoPairs !== 0) && (this.combination.quads === 0)) {
        const secondPair = (this.combination.twoPairs - this.combination.pair) / 2

        if (secondPair === (this.combination.triple / 3)) {
          this.combination.full = this.combination.triple + this.combination.pair
        } else {
          this.combination.full = this.combination.triple + (secondPair * 2)
        }
      }

      // calculate chance score
      if (item.length > 0) {
        const currentChanceValue = this.combination.chance
        this.combination.chance = currentChanceValue + value * item.length
      }
    }
  }

}

export default new ShScore()
