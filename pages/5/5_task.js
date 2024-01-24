// Получаем коллекцию изображений
const images = document.querySelectorAll('img');

// Получаем информацию о блоке с контентом
const contentBorderInfo = document.getElementsByClassName('content')[0].getBoundingClientRect();
const contentWidth = document.getElementsByClassName('content')[0].offsetWidth-100;
const contentHeight = document.getElementsByClassName('content')[0].offsetHeight-100;

let dictImages;

// перемешиваем элементы
for (let i = 0; i < images.length; i++) {
    randomizeImagesOnArea(images[i]);
}

for (let i = 0; i < images.length; i++) {
    mooveImage(images[i]);
}

function mooveImage(element) {
    let offsetX;
    let offsetY;
    let elementClass = null;

    // событие мыши нажатия
    element.addEventListener('mousedown', function (e) {
        offsetX = element.offsetLeft - e.clientX;
        offsetY = element.offsetTop - e.clientY;
        elementClass = element.className;
        // событие мыши передвижения
        document.addEventListener('mousemove', currentHandler)
    }, true);

    // событие мыши отпускание
    element.addEventListener('mouseup', function () {
        elementClass = null;
        document.removeEventListener('mousemove', currentHandler);
        element.removeEventListener('mousemove', currentHandler);
        fillDictionary();
        checkSolution();
    }, true);

    // событие двойного клика
    element.addEventListener('dblclick', function (e) {
        e.preventDefault();
        rotateImage(element);
        fillDictionary();
        checkSolution();
    }, true);

    let currentHandler = function(event) {
        if (elementClass === element.className) {
            // предотвращает выполнение стандартного действия, связанного с событием
            event.preventDefault();

            let pX = event.clientX;
            let pY = event.clientY;

            // проверка на выход за границы контента
            if (pX >= contentBorderInfo.left && pX <= contentBorderInfo.right && pY >= contentBorderInfo.top && pY <= contentBorderInfo.bottom) { 
                element.style.left = (event.clientX + offsetX) + 'px';
                element.style.top = (event.clientY + offsetY) + 'px';
            }
        }
    }
}

function rotateImage(element) {
    // Получаем текущий угол поворота элемента
    let currentRotation = 0;

    // Проверяем, есть ли уже угол поворота в стиле элемента
    const transformValue = element.style.transform;
    if (transformValue && transformValue.includes('rotate')) {
        const match = transformValue.match(/rotate\((.*?)deg\)/);
        if (match && match[1]) {
            currentRotation = parseFloat(match[1]);
        }
    }

    // Добавляем 45 градусов к текущему углу поворота
    const newRotation = currentRotation + 45;

    // Применяем поворот к элементу
    element.style.transform = `rotate(${newRotation}deg)`;
}

function randomizeImagesOnArea(element) {
    const randomX = Math.random() * (contentWidth - element.clientWidth);
    const randomY = Math.random() * (contentHeight - element.clientHeight);

    const randomRotation = Math.floor(Math.random() * 8) * 45;
    // const randomRotation = 0;

    element.style.left = randomX + 'px';
    element.style.top = randomY + 'px';
    element.style.transform = `rotate(${randomRotation}deg)`;
}

function fillDictionary() {
    const newImages = document.querySelectorAll('img');
    newDictImages = {};

    for (let i = 0; i < newImages.length; i++) {
        let key = images[i].className;
        newDictImages1 = {};
        
        newDictImages1['border_info'] = newImages[i].getBoundingClientRect();
        newDictImages1['rotate_info'] = newImages[i].style.transform.match(/rotate\((.*?)deg\)/)[1];

        newDictImages[key] = newDictImages1;      
    }

    dictImages = newDictImages;
}

function checkSolution() {
    if (dictImages['img_body']['rotate_info'] % 8 == 0 && dictImages['img_rLeg']['rotate_info'] % 8 == 0 && dictImages['img_lLeg']['rotate_info'] % 8 == 0 && dictImages['img_head']['rotate_info'] % 8 == 0) {
        if (
            (
                5 >= dictImages['img_head']['border_info'].right - dictImages['img_body']['border_info'].left
                && dictImages['img_head']['border_info'].right - dictImages['img_body']['border_info'].left >= -5
            )
            &&
            (
                5 >= dictImages['img_head']['border_info'].bottom - dictImages['img_lLeg']['border_info'].top
                && dictImages['img_head']['border_info'].bottom - dictImages['img_lLeg']['border_info'].top >= -5
            )
            &&
            (
                5 >= dictImages['img_body']['border_info'].bottom - dictImages['img_rLeg']['border_info'].top
                && dictImages['img_body']['border_info'].bottom - dictImages['img_rLeg']['border_info'].top >= -5
            )
            &&
            (
                -235 >= dictImages['img_lLeg']['border_info'].right - dictImages['img_rLeg']['border_info'].left
                && dictImages['img_lLeg']['border_info'].right - dictImages['img_rLeg']['border_info'].left >= -245
            )
        ) {
            showCompletionMessage();
        }
    }
}

function showCompletionMessage() {
    var audio = new Audio('audio/win_sound.mp3');
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    audio.volume = 0.1;

    audio.play();
}
