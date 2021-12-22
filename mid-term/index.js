const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;

setContextSize(ROWS, COLUMNS, BLOCK_SIZE);

const board = new Board(ROWS, COLUMNS);

let scores = 0;
const scoreTag = document.querySelector('h2 span');

let animationId = null;

function gameReset() {
    board.reset();
    scores = 0;
    scoreTag.innerText = '0';
    cancelAnimationFrame(animationId);
}

let startTime = null;

function animate(timestamp) {
    if(!startTime) {
        startTime = timestamp;
    }
    
    const oneSecond = 1000;
    if(timestamp - startTime >= oneSecond) {
        board.moveCurrentPiece(keys.down);
        const oldNumberOfPreviousPiece = board.previousPieces.length;
        board.moveDownPreviousPiece();

        scores += oldNumberOfPreviousPiece - board.previousPieces.length ;
        scoreTag.innerText = scores.toString();

        startTime = null;
    }

    const { width, height } = context.canvas;

    context.clearRect(0, 0, width, height);

    board.draw();
    
    animationId = requestAnimationFrame(animate);
}

function handleKeyDown(event) {
    const { key } = event;

    if(key === keys.space) {
        play();
    } else {
        board.moveCurrentPiece(key);
    }
}

function setEventListener()  {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
}

function play() {
    gameReset();
    setEventListener();
    animate();
}

const rightButton = document.querySelector('#right');
rightButton.addEventListener('click', () => {
    board.moveCurrentPiece(keys.right);
});

const downButton = document.querySelector('#down');
downButton.addEventListener('click', () => {
    board.moveCurrentPiece(keys.down);
});

const leftButton = document.querySelector('#left');
leftButton.addEventListener('click', () => {
    board.moveCurrentPiece(keys.left);
});

const rotateButton = document.querySelector('#rotate');
rotateButton.addEventListener('click', () => {
    board.moveCurrentPiece(keys.up);
});

const restartButton = document.querySelector('#restart');
restartButton.addEventListener('click', play);

const startButton = document.querySelector('#start');
startButton.addEventListener('click', play);
startButton.addEventListener('click', () => {
    rightButton.disabled = false;
    leftButton.disabled = false;
    downButton.disabled = false;
    rotateButton.disabled = false;
    restartButton.disabled = false;
});