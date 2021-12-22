const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function setContextSize(rows, columns, blockSize) {
    context.canvas.width = columns * blockSize;
    context.canvas.height = rows * blockSize;
    context.scale(blockSize, blockSize);
}