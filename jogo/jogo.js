const buttons = document.querySelectorAll('.simon-button');
const startButton = document.querySelector('.start-button');

let sequence = [];
let userSequence = [];

function getRandomColor() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function flashButton(color) {
    const button = document.querySelector(`.simon-button[data-color="${color}"]`);
    button.style.opacity = 1;
    setTimeout(() => {
        button.style.opacity = 0.5;
    }, 400);
}

function playSequence() {
    let index = 0;
    const interval = setInterval(() => {
        flashButton(sequence[index]);
        index++;
        if (index >= sequence.length) {
            clearInterval(interval);
        }
    }, 800);
}

function startGame() {
    sequence = [];
    userSequence = [];
    for (let i = 0; i < 5; i++) {
        sequence.push(getRandomColor());
    }
    playSequence();
}

function checkSequence() {
    for (let i = 0; i < userSequence.length; i++) {
        if (userSequence[i] !== sequence[i]) {
            return false;
        }
    }
    return true;
}

function buttonClick(event) {
    const color = event.target.dataset.color;
    userSequence.push(color);
    flashButton(color);

    if (!checkSequence()) {
        alert('Game Over! Wrong sequence.');
        userSequence = [];
    } else if (userSequence.length === sequence.length) {
        alert('Congratulations! You won!');
    }
}

buttons.forEach(button => {
    button.addEventListener('click', buttonClick);
});

startButton.addEventListener('click', startGame);
