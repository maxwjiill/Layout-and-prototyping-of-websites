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
        { question: 'Выступает ли волк в цирке?', answer: 'нет' },
        { question: 'Могут ли львы жить в джунглях?', answer: 'нет' },
        { question: 'Спит ли бегемот под водой?', answer: 'нет' },
    ]
    },
    {
        type: 'matching',
        name: 'Уровень 2',
        riddle: 'Какой из этих персонажей является сигмой?',
        answer: 'Кошка',
        images: ['images/sigma.webp', 'images/omega.jpeg', 'images/alpha.jpeg'],
        options: ['Кошка', 'Собака', 'Мышь']
    },
    {
        type: 'matching',
        name: 'Уровень 2',
        riddle: 'Кто лучший друг человека?',
        answer: 'Собака',
        images: ['images/cat.png', 'images/dog.png', 'images/mouse.webp'],
        options: ['Кошка', 'Собака', 'Мышь']
    },
    {
        type: 'matching',
        name: 'Уровень 2',
        riddle: 'Кто из этих персонажей Джерри?',
        answer: 'Мышь',
        images: ['images/cat.png', 'images/dog.png', 'images/mouse.webp'],
        options: ['Кошка', 'Собака', 'Мышь']
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

    document.removeEventListener('keydown', moveBall); // Удаляем предыдущий обработчик
    document.addEventListener('keydown', moveBall); // Добавляем новый обработчик
}

function generateLevel() {
    let level = levels[currentLevel - 1];
    if (level.type === 'question') {
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('matching-screen').style.display = 'none';
    document.getElementById('goalie-game').style.display = 'none';
    if (currentQuestion < level.questions.length) {
        document.getElementById('question').innerText = level.questions[currentQuestion].question;
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
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('matching-screen').style.display = 'block';
    document.getElementById('goalie-game').style.display = 'none';
    document.getElementById('playerGreetMatching').innerText = playerName;
    document.getElementById('matching-level').innerText = level.name;
    document.getElementById('riddle').innerText = level.riddle;
    resetMatchingLevel();
    level.options.forEach((option, index) => {
        let imageElement = document.createElement('img');
        imageElement.src = level.images[index];
        imageElement.classList.add('image');
        imageElement.setAttribute('draggable', 'true');
        imageElement.setAttribute('ondragstart', 'drag(event)');
        imageElement.setAttribute('id', `image${index}`);
        imageElement.setAttribute('data-option', option);
        document.getElementById('images-container').appendChild(imageElement);
    });
    document.getElementById('score-matching').innerText = score;
    } else if (level.type === 'goalie') {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('matching-screen').style.display = 'none';
    document.getElementById('goalie-game').style.display = 'block';
    document.getElementById('playerGreetGoalie').innerText = playerName;
    document.getElementById('goalie-level').innerText = level.name;
    document.getElementById('field').innerHTML = `
        <div class="goalie-obstacle" style="top: 100px; left: 300px;"></div>
        <div class="goalie-obstacle" style="top: 200px; left: 250px;"></div>
        <div class="goalie-obstacle" style="top: 200px; left: 350px;"></div>
        <div class="goalie-obstacle" style="top: 300px; left: 150px;"></div>
        <div class="goalie-obstacle" style="top: 300px; left: 300px;"></div>
        <div class="goalie-obstacle" style="top: 300px; left: 450px;"></div>
        <!-- Оставшийся код для ворот и мяча -->
        <div id="goal" style="position: absolute; width: 120px; height: 50px; background-color: #000; left: 250px; bottom: 10px; box-sizing: border-box; border: 2px solid #fff;"></div>
        <div id="ball"></div>
    `;
    document.getElementById('score-goalie').innerText = score;
    resetBall();
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
        // Столкновение с преградой
        score -= 5; // Уменьшить очки при столкновении
        document.getElementById('score-goalie').innerText = score; // Обновляем отображение очков
        resetBall(); // Переместить мяч в начальное положение
        endGame(); // Вызываем endGame() при столкновении с преградой
    }
    });
}

function moveBall(event) {
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

        document.removeEventListener('keydown', moveBall); // Удаляем обработчик события

        // Добавляем следующие две строки
        endGame(); // Добавить вызов функции endGame() при попадании ворот
        document.getElementById('goalie-game').style.display = 'none';
    }
}

function giveUp() {
    score -= 5;
    document.getElementById('score-goalie').innerText = score;

    document.removeEventListener('keydown', moveBall); // Удаляем обработчик события
    document.getElementById('goalie-game').style.display = 'none';
    endGame(); // Добавить вызов endGame() при сдаче
}

function checkMatching() {
    let level = levels[currentLevel - 1];
    let answerBox = document.getElementById('answer-box');
    let droppedImage = answerBox.querySelector('img');
    let selectedOption = droppedImage ? droppedImage.dataset.option : '';
    if (selectedOption === level.answer) {
    score += 10;
    } else {
    score -= 5;
    }
    document.getElementById('score-matching').innerText = score;
    answerBox.innerHTML = '';
    endCurrentLevel();
}

function checkAnswer(answer) {
    let level = levels[currentLevel - 1];
    let questionObj = level.questions[currentQuestion];
    let isCorrect = (answer === 'yes' && questionObj.answer === 'да') || (answer === 'no' && questionObj.answer === 'нет');

    if (isCorrect) {
    score += 10;
    document.getElementById('score').innerText = score;
    document.getElementById('score').classList.remove('score-red');
    document.getElementById('score').classList.add('score-green');
    } else {
    score -= 5;
    document.getElementById('score').innerText = score;
    document.getElementById('score').classList.remove('score-green');
    document.getElementById('score').classList.add('score-red');
    }

    setTimeout(() => {
    document.getElementById('score').classList.remove('score-green');
    document.getElementById('score').classList.remove('score-red');
    }, 1500);

    currentQuestion++;
    generateLevel();
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

function endGame() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('matching-screen').style.display = 'none';
    document.getElementById('goalie-game').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    if (score >= 60) {
        document.getElementById('end-message').innerText = playerName + ', вы выиграли';
        document.getElementById("win-sound").play();
    } else {
        document.getElementById('end-message').innerText = playerName + ', вы проиграли';
        document.getElementById("lose-sound").play();
    }
    document.getElementById('final-score').innerText = score;
    savePlayerScore();
    displayPlayerScores();

    if (currentLevel === 5) { // Поменял на 5, потому что третий уровень имеет индекс 4 в массиве levels
        document.removeEventListener('keydown', moveBall); // Удаляем обработчик события
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

    if (currentLevel === 5) { // Поменял на 5, потому что третий уровень имеет индекс 4 в массиве levels
        document.removeEventListener('keydown', moveBall); // Удаляем обработчик события
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
