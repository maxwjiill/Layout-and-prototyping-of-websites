function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const phrases = [
    { latin: "\"Consuetudo est altera natura\"", translation: "\"Привычка - вторая натура\"" },
    { latin: "\"Nota bene\"", translation: "\"Заметьте хорошо!\"" },
    { latin: "\"Nulla calamitas sola\"", translation: "\"Беда не приходит одна\"" },
    { latin: "\"Per aspera ad astra\"", translation: "\"Через тернии к звёздам\"" }
];

let suffeldArray = shuffleArray(phrases);
let currentC = 0;
let clickC = 0;
let t3Count = 0;

function randomPhrase() {
    if (currentC >= suffeldArray.length) {
        alert("Фразы закончились");
        return;
    }

    const phraseContainer = document.getElementById("phrase-container");
    const currentPhrase = suffeldArray[currentC];
    const newDiv = document.createElement("div");

    newDiv.textContent = currentPhrase.latin + " - " + currentPhrase.translation;
    newDiv.className = clickC % 2 === 0 ? "class2" : "class1";

    phraseContainer.appendChild(newDiv);

    currentC++;
    clickC++;
}

function switchFont() {
    const phraseContainer = document.getElementById("phrase-container");
    const evenPhrases = phraseContainer.querySelectorAll(".class2");

    evenPhrases.forEach(phrase => phrase.classList.toggle("bold"));
}

function createNewLine() {
    if (t3Count >= phrases.length) {
        alert("Все фразы созданы");
        return;
    }

    const randDiv = document.getElementById("aside");
    
    const orderedListLatin = document.createElement("ol");
    orderedListLatin.start = t3Count+1;
    orderedListLatin.className = t3Count % 2 === 0 ? "class2" : "class1";

    const unorderedListRussian = document.createElement("ul");
    unorderedListRussian.className = t3Count % 2 === 0 ? "class22" : "class11";
    
    const currentPhrase = suffeldArray[t3Count];

    const listItemLatin = document.createElement("li");
    listItemLatin.innerHTML = `<i>${currentPhrase.latin}</i>`;
    orderedListLatin.appendChild(listItemLatin);

    const listItemRussian = document.createElement("li");
    listItemRussian.innerHTML = currentPhrase.translation;

    // const listItemRussian = document.createElement("ul");
    // listItemRussian.innerHTML = `\t<b>•</b> ${currentPhrase.translation}`;

    unorderedListRussian.appendChild(listItemRussian);

    randDiv.appendChild(orderedListLatin);
    randDiv.appendChild(unorderedListRussian);

    t3Count++;
}