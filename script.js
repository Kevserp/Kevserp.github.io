const moviesObject = {
  "beauty and the beast": ["images/rose.jpg", "images/princess.jpg","images/monster.jpg"],
  "up": ["images/baloon.jpg", "images/house.jpg", "images/oldman.jpg"],
  "it": ["images/clown.jpg", "images/spider.jpg"],
  "titanic": ["images/roseandjack.jpg", "images/ship.jpg", "images/wave.jpg"],
  "the silence of the lambs": ["images/mute.jpg", "images/sheep.jpg"],
  "matrix":["images/red.jpg","images/vs.jpg", "images/blue.jpg", "images/pill.jpg"],
  "batman":["images/bat.jpg", , "images/man.jpg"],

};

const container = document.querySelector(".container");
const startButton = document.getElementById("start");
const letterContainer = document.getElementById("letter-container");
const guessButton = document.getElementById("checkButton");
const resultText = document.getElementById("result");
const chanceCountElement = document.getElementById("chanceCount");
const userInputSection = document.getElementById("userInputSection");

let remainingMovies = Object.keys(moviesObject);
let randomHint = "";
let chanceCount = 4;
let correctGuesses = 0;

const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

const blocker = () => {
  document.querySelectorAll(".letters, #checkButton").forEach((element) => {
    element.disabled = true;
  });
};

const checkGuess = () => {
  console.log("checkGuess function called.");

  const inputSpaceElements = document.querySelectorAll('.inputSpace');
  const userGuess = Array.from(inputSpaceElements).map(space => space.innerText.replace(/\s/g, "")).join('').toLowerCase();
  console.log("userGuess:", userGuess);

  if (userGuess === randomHint.toLowerCase().replace(/\s/g, "")) {
    resultText.innerHTML = "Correct! Next Movie.";

    correctGuesses += 1;
    console.log("Correct guess. Incrementing correctGuesses. Total Correct Guesses:", correctGuesses);

    if (correctGuesses === Object.keys(moviesObject).length) {
      chanceCountElement.innerHTML = `Your Score: ${correctGuesses}`;
      blocker();
      guessButton.disabled = true;
      guessButton.innerText = "GAME OVER";
      console.log("YOU WON.");
    } else {
      console.log("Moving to the next movie.");

      const movieIndex = remainingMovies.indexOf(randomHint);
      if (movieIndex !== -1) {
        remainingMovies.splice(movieIndex, 1);
      }

      generateWord();
    }
  } else {
    chanceCount -= 1;
    chanceCountElement.innerHTML = `<span>Tries Left:</span> ${chanceCount}`;
    if (chanceCount < 0) {
      chanceCountElement.innerHTML = `Your Score: ${correctGuesses}`;
      blocker();
      guessButton.disabled = true;
      guessButton.innerText = "GAME OVER";
    } else {
      guessButton.disabled = false;
      guessButton.innerText = "Check";
      resetInput();
    }
  }
};

const resetInput = () => {
  let inputSpaceElements = document.querySelectorAll('.inputSpace');
  let letterButtons = document.querySelectorAll(".letters");

  Array.from(inputSpaceElements).forEach((space) => {
    if(space.textContent.match(/[a-z]/i)){
     // console.log("content is : " + space.textContent)
      space.innerText = "_";

    }else{
    //  console.log("no")
      space.innerText = " ";
    }

  });

  letterButtons.forEach((button) => {
    button.classList.remove("used");
    button.disabled = false;
  });

  checkIfWordIsComplete();
 // userInputSection.innerText = "";


};

const generateWord = () => {
  letterContainer.classList.remove("hide");
  const minWidth = 500;

  if (remainingMovies.length === 0) {
    remainingMovies = Object.keys(moviesObject);
  }

  const shuffledMovies = remainingMovies.sort(() => Math.random() - 0.5);
  randomHint = shuffledMovies[0];
  const randomWord = moviesObject[randomHint];

  if (randomWord && randomWord.length > 0) {
    remainingMovies = remainingMovies.filter(movie => movie !== randomHint);

    container.innerHTML = randomWord.map((imagePath, index) =>
      `<img src="${imagePath.replace(/\\/g, '/').replace(/ /g, '%20')}" alt="Movie Hint ${index + 1}" class="movieImage">`
    ).join('');

    let displayItem = randomHint.split("").map(value =>
      (value === " ") ? '<span class="inputSpace">&nbsp;</span>' : '<span class="inputSpace">_</span>'
    ).join('');

    userInputSection.innerHTML = displayItem;

    letterContainer.innerHTML = "";

    for (let i = 65; i < 91; i++) {
      let button = document.createElement("button");
      button.classList.add("letters");
      button.innerText = String.fromCharCode(i);
      button.addEventListener("click", () => {
        let inputSpaceElements = document.querySelectorAll('.inputSpace');
        let nextEmptySpaceIndex = Array.from(inputSpaceElements).findIndex(space => space.innerText === "_");

        if (nextEmptySpaceIndex !== -1) {
          button.classList.add("used");
          inputSpaceElements[nextEmptySpaceIndex].innerText = button.innerText;
          checkIfWordIsComplete();
        }
      });
      letterContainer.appendChild(button);
    }
  } else {
    console.error(`Invalid randomWord for ${randomHint}`);
    generateWord();
  }
};

const checkIfWordIsComplete = () => {
  let inputSpaceElements = document.querySelectorAll('.inputSpace');
  let filledSpaces = Array.from(inputSpaceElements).filter(space => space.innerText !== "_");
  guessButton.disabled = (filledSpaces.length === randomHint.length) ? false : true;
};

const initializeCheckButton = () => {
  guessButton.disabled = true;
};

const startGame = () => {
  resetGame();
  generateWord();
  guessButton.disabled = false;
};

const resetGame = () => {
  chanceCount -= 1;
  chanceCountElement.innerHTML = `<span>Tries Left:</span> ${chanceCount}`;
  resultText.innerHTML = "";
  guessButton.disabled = true;

  if (chanceCount === 0) {
    blocker();
  }
};

startButton.addEventListener("click", () => {
  document.querySelector(".controls-container").classList.add("hide");
});

window.onload = () => {
  startGame();
  initializeCheckButton();
};

guessButton.addEventListener("click", checkGuess);
