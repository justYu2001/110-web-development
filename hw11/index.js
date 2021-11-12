(() => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const { PI } = Math;

    const radius = canvas.height / 2;
    context.translate(radius, radius);

    function drawClockFace() {
        context.beginPath();
        context.arc(0, 0, radius * 0.9, 0, 2 * PI);
        const gradient = context.createLinearGradient(50, 100, 150, 100);
        gradient.addColorStop(0, '#fd1d1d');
        gradient.addColorStop(1, '#fcb045');
        context.fillStyle = gradient;
        context.closePath();
        context.fill();

        context.beginPath();
        context.arc(0, 0, 20, 0, 2 * PI);
        context.fillStyle = 'black';
        context.closePath();
        context.fill();


    }

    function drawClockNumbers() {
        context.font = '20px arial';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.lineWidth = 5;
        context.strokeStyle = 'black';

        let angle = PI / 6;
        const romanNumbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        for(let i = 0; i < 12; i++) {
            context.rotate(angle);
            context.translate(0, -0.8 * radius);
            context.fillText(romanNumbers[i], 0, 0);
            context.beginPath();
            context.moveTo(0, -0.1 * radius);
            context.lineTo(0, -13);
            context.closePath();
            context.stroke();
            context.translate(0, 0.8 * radius);
        }

        context.lineWidth = 3;

        angle = PI / 30;
        for(let i = 0; i < 60; i++) {
            context.rotate(angle);
            context.translate(0, -0.9 * radius);
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, 5);
            context.closePath();
            context.stroke();
            context.translate(0, 0.9 * radius);
        }
    }

    function drawHand(width, length, position, color) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.lineCap = 'round';
        context.moveTo(0, 0);
        context.rotate(position);
        context.lineTo(0, -length);
        context.stroke();
        context.rotate(-position);
    }

    function drawTime() {
        const currentTime = new Date();
        const hour = currentTime.getHours() % 12;
        const minute = currentTime.getMinutes();
        const second =  currentTime.getSeconds();
        const milliseconds = currentTime.getMilliseconds();

        const hourPosition = (hour * PI / 6) + 
                             (minute * PI / (6 * 60)) + 
                             (second * PI / (360 * 60));
        drawHand(15, radius * 0.5, hourPosition, 'blue');

        const minutePosition = (minute * PI / 30) + (second * PI / (30 * 60)); 
        drawHand(15, radius * 0.7, minutePosition, 'green');

        const secondPosition = milliseconds * PI / 500;
        drawHand(3, radius * 0.8, secondPosition, 'white');
    }

    function drawClock() {
        drawClockFace();
        drawClockNumbers();
        drawTime();
    }
    window.setInterval(drawClock, 1);
})();