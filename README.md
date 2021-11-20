# auto-starquiz
Script to automatically solve StarQuiz questions in MovieStarPlanet 2. 

### Video demo
[Video](https://youtu.be/2A0kKcAAZNs)

### Usage
- Open and log in to MovieStarPlanet 2.
  - Do not join a StarQuiz yet.
- Copy and paste the entire [index.js](https://github.com/LiterallyFabian/auto-starquiz/blob/master/index.js) script into your debug console (Ctrl+Shift+I).
- Write `init("your_LANGUAGE");` in the console.
  - For example `init("sv_SE");`.
- Join a StarQuiz.

Note that some answers might be incorrect, the reason for this can be read [here](https://github.com/LiterallyFabian/StarQuizSolver#problems).

### Contribution
Placing something like this in the `runGame();` method seems to answer the question locally, however no rewards will be granted after the quiz is finished. Probably shouldn't be too hard to solve, but it's nothing I plan to do. 
```js
ws.send(`42["quiz:answer",{"answer":1}]`)
```
