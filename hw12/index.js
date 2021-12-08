(() => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const { PI, sin, cos } = Math;

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw(x, y) {
        context.beginPath();
        context.arc(x, y, 20, 0, 2 * PI);
        context.fillStyle = 'black';
        context.closePath();
        context.fill();
    }

    const clockwiseButton = document.querySelector('.clockwise');
    const counterclockwiseButton = document.querySelector('.counterclockwise');
    let i = 0;


    draw(250, 350);

    function turn(direction) {
        if(direction === 'clockwise') {
            i++;
        } else {
            i--;
        }

        const yOfPosition = 250 + 100 * sin(2 * PI * i / 60);
        const xOfPosition = 250 + 100 * cos(2 * PI * i / 60);

        clear();
        draw(yOfPosition, xOfPosition);
    }

    let intervalId;
    
    clockwiseButton.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = setInterval(() => turn('clockwise'), 100);
    });

    counterclockwiseButton.addEventListener('click', () => {
        clearInterval(intervalId);
        intervalId = setInterval(() => turn('counterclockwise'), 100);
    });
})();