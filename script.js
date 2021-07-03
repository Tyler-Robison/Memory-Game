const gameContainer = document.getElementById("game");
const buttonContainer = document.querySelector('#buttonContainer');
const triesCounter = document.querySelector('#triesSpan');
const highScoreSpan = document.querySelector('#highScoreSpan');
const reminder = document.querySelector('#reminder');
triesCounter.innerText = 0;
let cardsClicked = 0;
let tries = 0;
let firstCardClicked;
let secondCardClicked;
let gameStarted = false;

const COLORS = [
  "red",
  "red",
  "blue",
  "blue",
  "green",
  "green",
  "orange",
  "orange",
  "purple",
  "purple",
  "pink",
  "pink",
  "black",
  "black",
  "brown",
  "brown",
  "grey",
  "grey",
  "lightgreen",
  "lightgreen"
];

let unShuffledCOLORS = COLORS.slice(0);

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  if (gameStarted === true) {
    cardsClicked++;
    if (cardsClicked === 1) {
      firstCardClicked = event.target; //stores value of first event.target for later comparison to second. 
      firstCardClicked.style.backgroundColor = firstCardClicked.classList[0]; //reveals color
    } else if (cardsClicked === 2) {
      if (firstCardClicked === event.target) {
        cardsClicked = 1;
        return
      }
      handleSecondClick(firstCardClicked, event);
    }
  }
  else if (!gameStarted) {
    reminder.innerText = 'Click Start Game button to begin game!';
  }
}


function handleSecondClick(firstCardClicked, event) {
  tries++;
  triesCounter.innerText = `${tries}`;
  secondCardClicked = event.target;
  secondCardClicked.style.backgroundColor = secondCardClicked.classList[0];
  if (firstCardClicked.classList[0] === secondCardClicked.classList[0] && firstCardClicked !== secondCardClicked) { //Card colors match, and are different cards.
    removeEventListeners(firstCardClicked, secondCardClicked);
    removeCards();
  }
  else if (firstCardClicked.classList[0] !== secondCardClicked.classList[0]) { //Cards don't match.
    setTimer(firstCardClicked, secondCardClicked);
  }
}

function removeCards() {
  for (let i = 0; i < remainingCards.length; i++) {
    if (remainingCards[i].classList[0] === firstCardClicked.classList[0]) {
      remainingCards.splice(i, 1);
      i--; //This solves edge-case where matching pairs are next to each other. 
    }
  }
  cardsClicked = 0;
  if (remainingCards.length === 0) {
    highScore();
  }
}

function highScore() { //Can only be reached inside removeCards function - triggered when last pair removed. 
  if (localStorage.getItem('highScore') !== null) { //Checks that there is a stored highScore
    if (tries < JSON.parse(localStorage.highScore)) {
      localStorage.setItem('highScore', JSON.stringify(tries));
      highScoreSpan.innerText = `Your score of ${tries} is the new high score!`;
    } else if (tries === JSON.parse(localStorage.highScore)) {
      highScoreSpan.innerText = `Your score of ${tries} tied the highscore of ${tries} tries.`;
    }
    else {
      highScoreSpan.innerText = `Your score of ${tries} did not beat the highscore of ${JSON.parse(localStorage.highScore)} tries.`;
    }
  } else {
    localStorage.setItem('highScore', JSON.stringify(tries)); //If no stored score, store current score. 
    highScoreSpan.innerText = `Your score of ${tries} is the new high score!`;
  }
}

function setTimer(firstCardClicked, secondCardClicked) {
  setTimeout(function () {
    firstCardClicked.style.backgroundColor = 'white';
    secondCardClicked.style.backgroundColor = 'white';
    cardsClicked = 0;
  }, 1000)
}

function selectCards() {
  allCards = gameContainer.querySelectorAll('div');
  remainingCards = Array.from(allCards); //allCards is a Nodelist. Array.from creates an array from an array-like object.
}

function resetGame() {
  gameContainer.innerHTML = '';
  let newArr = unShuffledCOLORS.slice(20 - parseInt(numberSelect.value));
  let newCOLORS = shuffle(newArr);
  createDivsForColors(newCOLORS);
  selectCards();
  triesCounter.innerText = 0;
  tries = 0;
  cardsClicked = 0;
  highScoreSpan.innerText = '';
}

function removeEventListeners(firstCardClicked, secondCardClicked) {
  firstCardClicked.removeEventListener("click", handleCardClick);
  secondCardClicked.removeEventListener("click", handleCardClick);
}

buttonContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.id === 'resetButton') {
    resetGame();
  } else if (e.target.id === 'startButton') {
    gameStarted = true;
    reminder.innerText = '';
  }
})

numberSelect.addEventListener('change', function () {
  gameContainer.innerHTML = '';
  let newArr = unShuffledCOLORS.slice(20 - parseInt(numberSelect.value));
  let newCOLORS = shuffle(newArr);
  createDivsForColors(newCOLORS);
  selectCards();
  triesCounter.innerText = 0;
  tries = 0;
  cardsClicked = 0;
  highScoreSpan.innerText = '';
  localStorage.removeItem('highScore');
})

// when the DOM loads
createDivsForColors(shuffledColors);
selectCards();