import ShScore from './sh-score'

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
})
