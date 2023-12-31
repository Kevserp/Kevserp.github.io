const moviesObject = {
  "beauty and the beast": ["images/rose.jpg", "images/princess.jpg", "images/monster.jpg"],
  "up": ["images/baloon.jpg", "images/house.jpg", "images/oldman.jpg"],
  "it": ["images/clown.jpg", "images/spider.jpg"],
  "titanic": ["images/roseandjack.jpg", "images/ship.jpg", "images/wave.jpg"],
  "the silence of the lambs": ["images/mute.jpg", "images/sheep.jpg"],
  "star wars": ["images/star.jpg", "images/swords.png"],
  "batman": ["images/bat.jpg", "images/man.jpg"],
};

const container = document.querySelector(".container");
const startButton = document.getElementById("start");
const controls = document.querySelector(".controls-container");
const letterContainer = document.getElementById("letter-container");
const userInputSection = document.getElementById("userInputSection");
const resultText = document.getElementById("result");

let score = 0;
let winCount = 0,
  lossCount = 5;
let usedTitles = [];

const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

const blocker = () => {
  let letterButtons = document.querySelectorAll(".letters");
  letterButtons.forEach((button) => {
    button.disabled = true;
  });

  if (lossCount === 0) {
    resultText.innerHTML = "Game Over";
  } else if (winCount === userInputSection.children.length) {
    resultText.innerHTML = "You Won";
    setTimeout(() => {
      generateTitle();
      letterButtons.forEach((button) => {
        button.disabled = false;
        button.classList.remove("used");
      });
      resultText.innerHTML = "";
    }, 1000);
  }
};

startButton.addEventListener("click", () => {

  controls.classList.add("hide");
  init();
});

const generateTitle = () => {
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  if (usedTitles.length === Object.keys(moviesObject).length) {
    document.getElementById("scoreEnd").innerHTML = score;
    document.getElementById("gameDone").classList.add("show");
    return;
  }

  let randomTitle;
  do {
    randomTitle = Object.keys(moviesObject)[generateRandomValue(Object.keys(moviesObject))];
  } while (usedTitles.includes(randomTitle));

  usedTitles.push(randomTitle);

  let imagePaths = moviesObject[randomTitle];
  container.innerHTML = "";

  imagePaths.forEach((imagePath) => {
    container.innerHTML += `<img src="${imagePath}" alt="Movie Image" />`;
  });

  let displayItem = "";
  winCount = 0;
  randomTitle.split("").forEach((value) => {
    displayItem += value === " " ? `<span class="inputSpace">&nbsp;</span>` : `<span class="inputSpace">_</span>`;
    winCount += value === " " ? 1 : 0;
  });

  userInputSection.innerHTML = displayItem;

  letterContainer.innerHTML = "";
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    button.innerText = String.fromCharCode(i);
    button.addEventListener("click", () => {
      let charArray = randomTitle.toUpperCase().split("");
      let inputSpace = document.getElementsByClassName("inputSpace");

      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          if (char === button.innerText) {
            button.classList.add("used");
            inputSpace[index].innerText = char;
            winCount += 1;
            if (winCount === charArray.length) {
              resultText.innerHTML = "You Won";
              score += 1;
              blocker();
            }
          }
        });
      } else {
        lossCount -= 1;
        document.getElementById("chanceCount").innerHTML = `<span>Chances Left :</span> ${lossCount}`;
        button.classList.add("used");
        if (lossCount === 0) {
          document.getElementById("gameLost").classList.add("show");
          document.getElementById("scoreEndLost").innerHTML = score;
          blocker();
        }
      }
      button.disabled = true;
    });
    letterContainer.appendChild(button);
  }
};

const init = () => {
  startButton.disabled = false;
  winCount = 0;
  lossCount = 5;
  document.getElementById("chanceCount").innerHTML = `<span>Chances Left :</span>${lossCount}`;
  usedTitles = [];
  userInputSection.innerHTML = "";
  generateTitle();
};

window.onload = () => {
  startButton.disabled = false;
  init();
};
