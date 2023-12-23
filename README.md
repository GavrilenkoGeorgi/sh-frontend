# :game_die: Sharlushka [![Netlify Status](https://api.netlify.com/api/v1/badges/0e514105-751d-43ee-9786-6685cd362085/deploy-status)](https://app.netlify.com/sites/sharlushka/deploys)

## PWA dice game

  This is a PWA demo, a simple game resembling [Yahtzee](https://en.wikipedia.org/wiki/Yahtzee). You can play as Anonymous or register with email to be able to save results. User stats are gathered during each game and can be viewed on user stats page. Libraries used: React, Redux, dnd-kit, Rechart, Webpack 5, Zod, Workbox. You can add it to your home screen on devices running Android, iOS and Windows.

### :wrench: Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9000
npm run dev
```

### :book: Some game concepts

From the 1967 Yahtzee rulebook:
> Each turn consists of a maximum of three rolls — the first roll to be made with all five dice. If the player elects to roll a second and third time, he may pick up and use any number of dice, providing a score is taken on the last roll. It is the skillful use of these two optional rolls of the dice that can turn an unlucky first or second roll into a high scoring turn.

So basically, in Sharluska you have thirty three turns, each turn consists of three rolls, or if you're lucky and got "poker" on the first roll, you can save current combination result immediately, so the remaining rolls are optional. But you have to complete all turns rolling the dice and saving results for each combination. If you're not so lucky, eventually you will have to write a zero to the empty combination, so that you can continue playing, but you should remember, more zeroes -- less score. Warm-up is different, you have to save all warm-up results, even negative, to complete it.
