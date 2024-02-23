let playerName = '';
let currentLevel = 1;
let score = 0;
let currentQuestion = 0;
let matchingImages = [];
let playerScores = [];

const levels = [
  {
    type: 'question',
    name: 'Уровень 1',
    questions: [
      { question: 'Какой из этих следов жирафа?', answer: 'жираф' },
      { question: 'Какой из этих следов утки?', answer: 'утка' },
      { question: 'Какой из этих следов медведя?', answer: 'медведь' },
    ]
  },
  {
    type: 'matching',
    name: 'Уровень 2',
    riddle: 'Какой из этих следов собаки?',
    answer: 'Собака',
    images: ['images/dog.avif', 'images/cat.png', 'images/fox.jpeg', 'images/chicken.png', 'images/hz.jpeg'],
    options: ['Лиса', 'Кошка', 'Собака', 'Курица', 'Хз']
  },
  {
    type: 'matching',
    name: 'Уровень 2',
    riddle: 'Какой из этих следов лисы?',
    answer: 'Лиса',
    images: ['images/dog.avif', 'images/cat.png', 'images/fox.jpeg', 'images/chicken.png', 'images/hz.jpeg'],
    options: ['Лиса', 'Кошка', 'Собака', 'Курица', 'Хз']
  },
  {
    type: 'matching',
    name: 'Уровень 2',
    riddle: 'Какой из этих следов кошки?',
    answer: 'Кошка',
    images: ['images/dog.avif', 'images/cat.png', 'images/fox.jpeg', 'images/chicken.png', 'images/hz.jpeg'],
    options: ['Лиса', 'Кошка', 'Собака', 'Курица', 'Хз']
  },
  {
    type: 'goalie',
    name: 'Уровень 3',
  }
];

function startGame() {
  playerName = document.getElementById('player-name').value;
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';
  document.getElementById('playerGreet').innerText = playerName;
  document.getElementById('game-level').innerText = levels[currentLevel - 1].name;
  document.getElementById('score').innerText = score;
  generateLevel();

  document.removeEventListener('keydown', moveBall);
  document.addEventListener('keydown', moveBall);
}

function getRandomPosition(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateLevel() {
  console.log(currentLevel);
  let level = levels[currentLevel - 1];
  if (level.type === 'question') {
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('matching-screen').style.display = 'none';
    document.getElementById('goalie-game').style.display = 'none';
    if (currentQuestion < level.questions.length) {
      let questionObj = level.questions[currentQuestion];
      document.getElementById('question').innerText = questionObj.question;

      let imagePaths = ['images/duck.png', 'images/giraffe.jpeg', 'images/bear.jpeg', 'images/chicken.png', 'images/hz.jpeg']; // замените на ваши пути к картинкам
      shuffleArray(imagePaths);
      let answerImages = document.getElementsByClassName('image');
      for (let i = 0; i < answerImages.length; i++) {
        let imageName = imagePaths[i].split('/').pop().split('.')[0];
        answerImages[i].setAttribute('onclick', 'checkAnswer("'+imageName+'")');
        answerImages[i].src = imagePaths[i];
      }
    } else {
      currentQuestion = 0;
      currentLevel++;
      if (currentLevel <= levels.length) {
        generateLevel();
      } else {
        endGame();
      }
      }
    } else if (level.type === 'matching') {

      function getRandomIndex(max) {
        return Math.floor(Math.random() * max);
      }
      let randomImages = [];
      let randomOptions = [];

      while (randomImages.length < level.images.length) {
        let randomIndex = getRandomIndex(level.images.length);
        if (!randomImages.includes(randomIndex)) {
          randomImages.push(randomIndex);
          randomOptions.push(level.options[randomIndex]);
        }
      }

      document.getElementById('game-screen').style.display = 'none';
      document.getElementById('matching-screen').style.display = 'block';
      document.getElementById('goalie-game').style.display = 'none';
      document.getElementById('playerGreetMatching').innerText = playerName;
      document.getElementById('matching-level').innerText = level.name;
      document.getElementById('riddle').innerText = level.riddle;
      resetMatchingLevel();
      randomImages.forEach((index, i) => {
        let imageElement = document.createElement('img');
        imageElement.src = level.images[index];
        imageElement.classList.add('image');
        imageElement.setAttribute('draggable', 'true');
        imageElement.setAttribute('ondragstart', 'drag(event)');
        imageElement.setAttribute('id', `image${index}`);
        imageElement.setAttribute('data-option', randomOptions[i]);
        document.getElementById('images-container').appendChild(imageElement);
      });
      document.getElementById('score-matching').innerText = score;
    } else if (level.type === 'goalie') {
      document.getElementById('game-screen').style.display = 'none';
      document.getElementById('matching-screen').style.display = 'none';
      document.getElementById('goalie-game').style.display = 'block';
      document.getElementById('playerGreetGoalie').innerText = playerName;
      document.getElementById('goalie-level').innerText = level.name;
  
    const field = document.getElementById('field');
    field.innerHTML = `
      <div id="goal" style="position: absolute; width: 120px; height: 50px; background-color: #000; left: 250px; bottom: 10px; box-sizing: border-box; border: 2px solid #fff;"></div>
      <div id="ball"></div>
    `;

    for (let i = 0; i < 8; i++) {
      let treeTop = getRandomPosition(110, 250);
      let treeLeft = getRandomPosition(100, 450);

      if (
        (treeTop < 50 || treeLeft < 190) ||
        (treeTop > 250 || treeLeft > 310) ||
        (treeLeft > 220 && treeLeft < 280 && treeTop > 100 && treeTop < 200) // не близко к медведю
      ) {
        const tree = document.createElement('div');
        tree.className = 'goalie-obstacle';
        tree.style.position = 'absolute';
        tree.style.left = `${treeLeft}px`;
        tree.style.top = `${treeTop}px`;

        const treeImage = document.createElement('img');
        treeImage.src = 'images/tree.png';
        treeImage.alt = 'Tree';
        tree.appendChild(treeImage);

        field.appendChild(tree);
      } else {
        i--;
      }
    }

    document.getElementById('score-goalie').innerText = score;
    resetBall();
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    }
}
  

function resetBall() {
  ballX = 190;
  ballY = 50;
  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
}

function checkObstacles() {
  const ballRect = ball.getBoundingClientRect();
  const obstacles = document.querySelectorAll('.goalie-obstacle');

  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
      ballRect.left < obstacleRect.right &&
      ballRect.right > obstacleRect.left &&
      ballRect.top < obstacleRect.bottom &&
      ballRect.bottom > obstacleRect.top
    ) {
      score -= 10;
      document.getElementById('score-goalie').innerText = score;
      resetBall();
      endGame();
    }
  });
}

function moveBall(event) {
  if (currentLevel === 5) {
    const key = event.key;
    const speed = 10;
    
    if (key === 'ArrowLeft') {
      ballX -= speed;
    } else if (key === 'ArrowRight') {
      ballX += speed;
    } else if (key === 'ArrowUp') {
      ballY -= speed;
    } else if (key === 'ArrowDown') {
      ballY += speed;
    }
    
    if (ballX < 0) {
      ballX = 0;
    } else if (ballX > field.offsetWidth - ball.offsetWidth) {
      ballX = field.offsetWidth - ball.offsetWidth;
    }
    
    if (ballY < 0) {
      ballY = 0;
    } else if (ballY > field.offsetHeight - ball.offsetHeight) {
      ballY = field.offsetHeight - ball.offsetHeight;
    }
    
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    
    checkGoal();
    checkObstacles();
  }
}

function checkGoal() {
  const ballRect = ball.getBoundingClientRect();
  const goalRect = goal.getBoundingClientRect();

  if (
    ballRect.left >= goalRect.left &&
    ballRect.right <= goalRect.right &&
    ballRect.top >= goalRect.top &&
    ballRect.bottom <= goalRect.bottom
  ) {
    score += 10;
    document.getElementById('score-goalie').innerText = score;
    resetBall();

    document.removeEventListener('keydown', moveBall);

    endGame();
    document.getElementById('goalie-game').style.display = 'none';
  }
}

function giveUp() {
  score -= 5;
  document.getElementById('score-goalie').innerText = score;
  document.removeEventListener('keydown', moveBall);
  document.getElementById('goalie-game').style.display = 'none';
  endGame();
}


function checkMatching() {
  let level = levels[currentLevel - 1];
  let answerBox = document.getElementById('answer-box');
  let droppedImage = answerBox.querySelector('img');
  let selectedOption = droppedImage ? droppedImage.dataset.option : '';
  if (selectedOption === level.answer) {
    score += 10;
    document.getElementById('score-matching').classList.remove('score-red');
    document.getElementById('score-matching').classList.add('score-green');
  } else {
    score -= 5;
    document.getElementById('score-matching').classList.remove('score-green');
    document.getElementById('score-matching').classList.add('score-red');
  }

  setTimeout(() => {
    document.getElementById('score-matching').classList.remove('score-green');
    document.getElementById('score-matching').classList.remove('score-red');
  }, 2000);

  document.getElementById('score-matching').innerText = score;
  answerBox.innerHTML = '';
  endCurrentLevel();
}

function checkAnswer(answer) {
  let level = levels[currentLevel - 1];

  if (level.type === 'question') {
    let questionObj = level.questions[currentQuestion];
    let isCorrect = (answer === 'bear' && questionObj.answer === 'медведь') || (answer === 'duck' && questionObj.answer === 'утка')  || (answer === 'giraffe' && questionObj.answer === 'жираф');

    if (isCorrect) {
      score += 10;
      document.getElementById('score').innerText = score;
      document.getElementById('score').classList.remove('score-red');
      document.getElementById('score').classList.add('score-green');
      document.getElementById('score-matching').classList.remove('score-red');
      document.getElementById('score-matching').classList.add('score-green');
    } else {
      score -= 5;
      document.getElementById('score').innerText = score;
      document.getElementById('score').classList.remove('score-green');
      document.getElementById('score').classList.add('score-red');
      document.getElementById('score-matching').classList.remove('score-green');
      document.getElementById('score-matching').classList.add('score-red');
    }

    setTimeout(() => {
      document.getElementById('score').classList.remove('score-green');
      document.getElementById('score').classList.remove('score-red');
    }, 2000);

    setTimeout(() => {
      document.getElementById('score-matching').classList.remove('score-green');
      document.getElementById('score-matching').classList.remove('score-red');
    }, 2000);

    currentQuestion++;
    generateLevel();
  } else if (level.type === 'matching') {
    let selectedOption = answer;
    let isCorrect = (selectedOption === level.options[0]);
    

    if (isCorrect) {
      score += 10;
      document.getElementById('score-matching').innerText = score;
      document.getElementById('score-matching').classList.remove('score-red');
      document.getElementById('score-matching').classList.add('score-green');
      document.getElementById('score-goalie').classList.remove('score-red');
      document.getElementById('score-goalie').classList.add('score-green');
    } else {
      score -= 5;
      document.getElementById('score-matching').innerText = score;
      document.getElementById('score-matching').classList.remove('score-green');
      document.getElementById('score-matching').classList.add('score-red');
      document.getElementById('score-goalie').classList.remove('score-green');
      document.getElementById('score-goalie').classList.add('score-red');
    }
    setTimeout(() => {
      document.getElementById('score-matching').classList.remove('score-green');
      document.getElementById('score-matching').classList.remove('score-red');
    }, 2000);

    setTimeout(() => {
      document.getElementById('score-goalie').classList.remove('score-green');
      document.getElementById('score-goalie').classList.remove('score-red');
    }, 2000);

    endCurrentLevel();
  } else if (level.type === 'goalie') {
    let selectedOption = answer;
    let isCorrect = (selectedOption === 'goal');

    if (isCorrect) {
      score += 10;
      document.getElementById('score-goalie').innerText = score;
      document.getElementById('score-goalie').classList.remove('score-red');
      document.getElementById('score-goalie').classList.add('score-green');
    } else {
      score -= 5;
      document.getElementById('score-goalie').innerText = score;
      document.getElementById('score-goalie').classList.remove('score-green');
      document.getElementById('score-goalie').classList.add('score-red');
    }

    setTimeout(() => {
      document.getElementById('score-goalie').classList.remove('score-green');
      document.getElementById('score-goalie').classList.remove('score-red');
    }, 1500);

    endCurrentLevel();
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var draggedImage = document.getElementById(data);
  event.target.appendChild(draggedImage);
}

function endCurrentLevel() {
  currentLevel++;
  if (currentLevel > levels.length) {
    endGame();
  } else {
    generateLevel();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function endGame() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('matching-screen').style.display = 'none';
  document.getElementById('goalie-game').style.display = 'none';
  document.getElementById('end-screen').style.display = 'block';
  if (score >= 30) {
    document.getElementById('end-message').innerText = playerName + ', вы выиграли';
    document.getElementById('win-sound').play();
  } else {
    document.getElementById('end-message').innerText = playerName + ', вы проиграли';
    document.getElementById('lose-sound').play();
  }
  document.getElementById('final-score').innerText = score;
  savePlayerScore();
  displayPlayerScores();

  if (currentLevel === 5) {
    document.removeEventListener('keydown', moveBall);
  }
}

function returnToMainMenu() {
  currentLevel = 1;
  score = 0;
  currentQuestion = 0;
  matchingImages = [];
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('matching-screen').style.display = 'none';
  document.getElementById('goalie-game').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('player-name').value = '';

  if (currentLevel === 5) {
    document.removeEventListener('keydown', moveBall);
  }
}

function resetMatchingLevel() {
  let imagesContainer = document.getElementById('images-container');
  while (imagesContainer.firstChild) {
    imagesContainer.removeChild(imagesContainer.firstChild);
  }
}

function savePlayerScore() {
  let playerScore = { name: playerName, score: score };
  playerScores.push(playerScore);
  localStorage.setItem('playerScores', JSON.stringify(playerScores));
}
	
function clearPlayerScores() {
  playerScores = [];
  localStorage.removeItem('playerScores');
  displayPlayerScores();
}

function displayPlayerScores() {
  let playerTable = '<h2>Таблица игроков</h2>';
  playerTable += '<table><tr><th>Имя игрока</th><th>Очки</th></tr>';
  playerScores.forEach(player => {
    playerTable += `<tr><td>${player.name}</td><td>${player.score}</td></tr>`;
  });
  playerTable += '</table>';
  playerTable += '<button onclick="clearPlayerScores()">Очистить таблицу</button>';
  document.getElementById('player-scores').innerHTML = playerTable;
}

document.addEventListener('keydown', moveBall);