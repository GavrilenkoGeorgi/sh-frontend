import ShScore from './sh-score'
import { GameCombinations } from '../types'

describe('ShScore Class', () => {
  let shScore: ShScore

  // This runs before every single 'it' block, guaranteeing a fresh state
  beforeEach(() => {
    shScore = new ShScore()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('rollDice', () => {
    it('should roll 5 new dice when no dice are selected', () => {
      // 1. Arrange: force Math.random() to produce dice value 4
      jest.spyOn(Math, 'random').mockReturnValue(0.5)

      // 2. Act: Call the method with empty arrays
      const result = shScore.rollDice([], [])

      // 3. Assert: We expect an array of five 4s
      expect(result).toHaveLength(5)
      expect(result).toEqual([4, 4, 4, 4, 4])
    })

    it('should roll the correct number of dice based on diceToRoll length', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.2)

      // We are holding 3 dice, and rolling 2 new ones
      const diceToRoll = [0, 0] // Length is 2
      const result = shScore.rollDice(diceToRoll, [1, 2, 3])

      expect(result).toHaveLength(2)
      expect(result).toEqual([2, 2])
    })
  })

  describe('getSchoolScore', () => {
    it('should return 0 for exactly 3 of a kind', () => {
      // Arrange: Three 2s
      const values = [2, 2, 2]

      // Act
      const result = shScore.getSchoolScore(values)

      // Assert: Index 1 (representing the number 2) should be 0. The rest null.
      expect(result).toEqual([null, 0, null, null, null, null])
    })

    it('should calculate negative scores for less than 3 of a kind', () => {
      // Arrange: Two 6s. The logic: (2 length - 3) * 6 = -6
      const values = [6, 6]

      // Act
      const result = shScore.getSchoolScore(values)

      // Assert: Index 5 (representing the number 6) should be -6
      expect(result).toEqual([null, null, null, null, null, -6])
    })

    it('should calculate positive scores for more than 3 of a kind', () => {
      // Arrange: Four 5s. The logic: (4 length - 3) * 5 = +5
      const values = [5, 5, 5, 5]

      // Act
      const result = shScore.getSchoolScore(values)

      // Assert: Index 4 (representing the number 5) should be 5
      expect(result).toEqual([null, null, null, null, 5, null])
    })

    it('should handle a mixed hand correctly', () => {
      // Arrange: One 1, Three 3s, One 6
      // 1s logic: (1 - 3) * 1 = -2
      // 3s logic: 3 of a kind = 0
      // 6s logic: (1 - 3) * 6 = -12
      const values = [1, 3, 3, 3, 6]

      // Act
      const result = shScore.getSchoolScore(values)

      // Assert
      expect(result).toEqual([-2, null, 0, null, null, -12])
    })

    it('should not leak school state between score calculations', () => {
      expect(shScore.getSchoolScore([6, 6])).toEqual([
        null,
        null,
        null,
        null,
        null,
        -6
      ])

      expect(shScore.getSchoolScore([2, 2, 2])).toEqual([
        null,
        0,
        null,
        null,
        null,
        null
      ])
    })
  })

  describe('sort', () => {
    it('should return values in ascending order', () => {
      expect(shScore.sort([5, 3, 1, 4, 2])).toEqual([1, 2, 3, 4, 5])
    })

    it('should not mutate the original array', () => {
      const original = [5, 3, 1]
      shScore.sort(original)
      expect(original).toEqual([5, 3, 1])
    })
  })

  describe('getScore', () => {
    it('should detect a pair', () => {
      const result = shScore.getScore([6, 6, 1, 2, 3])
      expect(result).toMatchObject({ pair: 12, twoPairs: 0, triple: 0 })
    })

    it('should detect two pairs and pick the highest as the pair score', () => {
      const result = shScore.getScore([3, 3, 5, 5, 1])
      expect(result).toMatchObject({ pair: 10, twoPairs: 16, triple: 0 })
    })

    it('should detect a triple', () => {
      const result = shScore.getScore([4, 4, 4, 1, 2])
      expect(result).toMatchObject({ triple: 12, full: 0, quads: 0 })
    })

    it('should detect a full house', () => {
      const result = shScore.getScore([2, 2, 3, 3, 3])
      expect(result).toMatchObject({ triple: 9, full: 13, quads: 0 })
    })

    it('should detect quads', () => {
      const result = shScore.getScore([5, 5, 5, 5, 1])
      expect(result).toMatchObject({ quads: 20, poker: 0 })
    })

    it('should detect poker and score it correctly', () => {
      // poker score = face * 5 + 80
      const result = shScore.getScore([5, 5, 5, 5, 5])
      expect(result).toMatchObject({ poker: 105, quads: 20 })
    })

    it('should detect small straight (1-5)', () => {
      const result = shScore.getScore([1, 2, 3, 4, 5])
      expect(result).toMatchObject({ small: 15, large: 0 })
    })

    it('should detect large straight (2-6)', () => {
      const result = shScore.getScore([2, 3, 4, 5, 6])
      expect(result).toMatchObject({ large: 20, small: 0 })
    })

    it('should always calculate chance as sum of all dice', () => {
      const result = shScore.getScore([1, 2, 3, 4, 5])
      expect(result.chance).toBe(15)
    })

    it('should return zeroed combinations for a non-scoring hand', () => {
      // no pair, no straight, no special combo
      const result = shScore.getScore([1, 2, 3, 4, 6])
      expect(result).toMatchObject({
        pair: 0,
        twoPairs: 0,
        triple: 0,
        full: 0,
        quads: 0,
        poker: 0,
        small: 0,
        large: 0
      })
    })
  })

  describe('getScoringDice', () => {
    it('should return matching dice for a school combination', () => {
      expect(shScore.getScoringDice([1, 1, 3, 5], 'ones')).toEqual([1, 1])
      expect(shScore.getScoringDice([6, 6, 6, 1, 2], 'sixes')).toEqual([
        6, 6, 6
      ])
    })

    it('should return the highest pair for pair combination', () => {
      expect(
        shScore.getScoringDice([6, 6, 3, 3, 1], GameCombinations.PAIR)
      ).toEqual([6, 6])
    })

    it('should return empty for pair when no pair exists', () => {
      expect(
        shScore.getScoringDice([1, 2, 3, 4, 5], GameCombinations.PAIR)
      ).toEqual([])
    })

    it('should return two highest pairs for twoPairs combination', () => {
      expect(
        shScore.getScoringDice([6, 6, 3, 3, 1], GameCombinations.TWOPAIRS)
      ).toEqual([6, 6, 3, 3])
    })

    it('should return empty for twoPairs when only one pair exists', () => {
      expect(
        shScore.getScoringDice([6, 6, 1, 2, 3], GameCombinations.TWOPAIRS)
      ).toEqual([])
    })

    it('should return the three-of-a-kind dice for triple', () => {
      expect(
        shScore.getScoringDice([4, 4, 4, 1, 2], GameCombinations.TRIPLE)
      ).toEqual([4, 4, 4])
    })

    it('should return triple + pair dice for full house', () => {
      expect(
        shScore.getScoringDice([3, 3, 5, 5, 5], GameCombinations.FULL)
      ).toEqual([5, 5, 5, 3, 3])
    })

    it('should return empty for full when only a triple exists', () => {
      expect(
        shScore.getScoringDice([4, 4, 4, 1, 2], GameCombinations.FULL)
      ).toEqual([])
    })

    it('should return the four-of-a-kind dice for quads', () => {
      expect(
        shScore.getScoringDice([2, 2, 2, 2, 5], GameCombinations.QUADS)
      ).toEqual([2, 2, 2, 2])
    })

    it('should return all five dice for poker', () => {
      expect(
        shScore.getScoringDice([4, 4, 4, 4, 4], GameCombinations.POKER)
      ).toEqual([4, 4, 4, 4, 4])
    })

    it('should return empty for poker when dice are not all the same', () => {
      expect(
        shScore.getScoringDice([4, 4, 4, 4, 5], GameCombinations.POKER)
      ).toEqual([])
    })

    it('should return all dice for small straight', () => {
      expect(
        shScore.getScoringDice([1, 2, 3, 4, 5], GameCombinations.SMALL)
      ).toEqual([1, 2, 3, 4, 5])
    })

    it('should return all dice for large straight', () => {
      expect(
        shScore.getScoringDice([2, 3, 4, 5, 6], GameCombinations.LARGE)
      ).toEqual([2, 3, 4, 5, 6])
    })

    it('should return all valid dice for chance', () => {
      expect(
        shScore.getScoringDice([1, 3, 5, 2, 6], GameCombinations.CHANCE)
      ).toEqual([1, 3, 5, 2, 6])
    })

    it('should return empty for an unknown combination', () => {
      expect(shScore.getScoringDice([1, 2, 3, 4, 5], 'unknown')).toEqual([])
    })

    // these tests model the real save flow: the user may have selected more dice
    // than the combination needs, and only the contributing dice should be returned
    describe('ignores non-contributing selected dice', () => {
      it('pair: only returns the two matching dice, not the extras', () => {
        // user selected 5 dice but only two form the pair
        expect(
          shScore.getScoringDice([6, 6, 1, 2, 3], GameCombinations.PAIR)
        ).toEqual([6, 6])
      })

      it('triple: only returns the three matching dice, not the extras', () => {
        // user selected 5 dice but only three form the triple
        expect(
          shScore.getScoringDice([4, 4, 4, 6, 6], GameCombinations.TRIPLE)
        ).toEqual([4, 4, 4])
      })

      it('quads: only returns the four matching dice, not the fifth', () => {
        expect(
          shScore.getScoringDice([5, 5, 5, 5, 3], GameCombinations.QUADS)
        ).toEqual([5, 5, 5, 5])
      })

      it('school (sixes): only returns the sixes from a mixed selection', () => {
        // user selected a mix; only the sixes count for this school category
        expect(shScore.getScoringDice([6, 6, 3, 3, 1], 'sixes')).toEqual([6, 6])
      })

      it('school (threes): only returns the threes from a mixed selection', () => {
        expect(shScore.getScoringDice([3, 3, 3, 6, 5], 'threes')).toEqual([
          3, 3, 3
        ])
      })

      it('twoPairs: only returns the four pair dice, drops the fifth', () => {
        // three 6s → highest pair is [6, 6], plus a pair of 3s; the third 6 is dropped
        expect(
          shScore.getScoringDice([6, 6, 6, 3, 3], GameCombinations.TWOPAIRS)
        ).toEqual([6, 6, 3, 3])
      })
    })
  })

  describe('combinationsStats', () => {
    it('should count how many times each combination scored positively', () => {
      const results = {
        pair: [10, 0, 6],
        triple: [0, 12],
        chance: [20, 15, 0]
      }
      const stats = shScore.combinationsStats(results)
      expect(stats.pair).toBe(2)
      expect(stats.triple).toBe(1)
      expect(stats.chance).toBe(2)
    })

    it('should return zero counts when no combination scored', () => {
      const results = { pair: [0, 0], triple: [0] }
      const stats = shScore.combinationsStats(results)
      expect(stats.pair).toBe(0)
      expect(stats.triple).toBe(0)
    })

    it('should reset stats between calls', () => {
      shScore.combinationsStats({ pair: [10, 10, 10] })
      const stats = shScore.combinationsStats({ pair: [5] })
      expect(stats.pair).toBe(1)
    })
  })
})
