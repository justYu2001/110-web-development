class Piece {
    #shape;
    #color;
    #x;
    #y;
    #typeId;

    constructor(typeId, x, y, shape) {
        const xLimits = [0, 6, 8, 8, 9, 7, 9, 9];

        this.#typeId = typeId;
        this.#color = images[typeId];
        this.#shape = shape ? shape : shapes[typeId];

        this.#x = x !== undefined ? x : Math.floor(Math.random() * xLimits[typeId]);
        
        if(y !== undefined) {
            this.#y = y;
        } else if(typeId === 5) {
            this.#y = -1;
        } else {
            this.#y = 0;
        }
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get shape() {
        return this.#shape;
    }

    isEmptyBlock(pieceTypeId) {
        return pieceTypeId === 0;
    }

    draw() {
        this.#shape.forEach((row, y) => {
            row.forEach((block, x) => {
                if(this.isEmptyBlock(block) === false) {
                    context.drawImage(this.#color, this.#x + x, this.#y + y, 1, 1);
                }
            });
        });
    }

    #setPosition(x, y) {
        this.#x = x;
        this.#y = y
    }

    #rotateClockwise() {
        const newShape = [];
        
        for(const row of this.#shape) {
            const newRow = [];
            for(const x of row) {
                newRow.push(x);
            }
            newShape.push(newRow);
        }

        for(let y = 0; y < newShape.length; y++) {
            for(let x = 0; x < y; x++) {
                [newShape[x][y], newShape[y][x]] = [newShape[y][x], newShape[x][y]];
            }
        }

        newShape.forEach(row => row.reverse());

        this.#shape = newShape;
    }

    move(keyCode) {
        const moves = {
            [keys.left]: () => this.#setPosition(this.#x - 1, this.#y),
            [keys.right]: () => this.#setPosition(this.#x + 1, this.#y),
            [keys.down]: () => this.#setPosition(this.#x, this.#y + 1),
            [keys.up]: () => this.#rotateClockwise(),
        }

        moves[keyCode]();
    }

    getNewPositionPiece(keyCode) {
        const newPositionPiece = new Piece(this.#typeId, this.#x, this.#y, this.#shape);
        newPositionPiece.move(keyCode);
        return newPositionPiece;
    }
}