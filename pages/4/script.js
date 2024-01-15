const phrases = [
    { latin: "\"Consuetudo est altera natura\"", translation: "\"Привычка - вторая натура\"" },
    { latin: "\"Nota bene\"", translation: "\"Заметьте хорошо!\"" },
    { latin: "\"Nulla calamitas sola\"", translation: "\"Беда не приходит одна\"" },
    { latin: "\"Per aspera ad astra\"", translation: "\"Через тернии к звёздам\"" }
];

let shuffledPhrases = shuffleArray(phrases);
let currentIndex = 0;
let clickCount = 0;
let paragraphCount = 0;

function showRandomPhrase() {
    if (currentIndex >= shuffledPhrases.length) {
        alert("Фразы закончились");
        return;
    }

    const phraseContainer = document.getElementById("phrase-container");
    const currentPhrase = shuffledPhrases[currentIndex];
    const newDiv = document.createElement("div");

    newDiv.textContent = currentPhrase.latin + " - " + currentPhrase.translation;
    newDiv.className = clickCount % 2 === 0 ? "class1" : "class2";

    phraseContainer.appendChild(newDiv);
    currentIndex++;
    clickCount++;
}

function changeFontWeight() {
    const phraseContainer = document.getElementById("phrase-container");
    const evenPhrases = phraseContainer.querySelectorAll(".class1");

    evenPhrases.forEach(phrase => phrase.classList.toggle("bold"));
}

function createNewParagraph() {
    const randDiv = document.getElementById("rand");
    const newParagraph = document.createElement("p");

    if (paragraphCount >= phrases.length) {
        alert("Все фразы созданы");
        return;
    }

    const currentPhrase = shuffledPhrases[paragraphCount];

    newParagraph.innerHTML = `<u>n=${paragraphCount}</u> <i>${currentPhrase.latin}</i> ${currentPhrase.translation}`;
    newParagraph.className = paragraphCount % 2 === 0 ? "class1" : "class2";
    randDiv.appendChild(newParagraph);

    paragraphCount++;
}

function shuffleArray(array) {  /* При открытие веб страницы массив данных каждый раз перемешивается*/ 
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
