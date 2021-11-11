(() => {
    const canvas = document.querySelector('canvas');

    const { PI } = Math;

    function draw(){
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(100, 100, 50, 0, 2 * PI);
        context.strokeStyle = '#0f0';
        context.lineWidth = '5';
        context.stroke();
        context.beginPath();
        context.arc(100, 100, 47.5, 0, 2 * PI);

        const gradient = context.createLinearGradient(50, 100, 150, 100);
        gradient.addColorStop(0, '#fd1d1d');
        gradient.addColorStop(1, '#fcb045');
        context.fillStyle = gradient;
        context.fill();

        context.fillStyle = '#fff';
        context.font = "30px Arial";
        context.fillText('hi', 100, 100);
    }

    const button = document.querySelector('button');

    button.addEventListener('click', draw);

})();