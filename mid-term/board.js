class Board {
    #board;
    #rows;
    #columns;
    #typeIdOfPieceQueue;
    #previousPieces;
    #currentPiece;

    
    constructor(rows, columns) {
        this.#rows = rows;
        this.#columns = columns;
        this.#board = this.getEmptyBoard();
        this.#typeIdOfPieceQueue = [1, 2, 3, 2];
        this.#previousPieces = [];
        this.spawn();
    }
    
    spawn() {
        const typeIdOfNewPiece = this.#typeIdOfPieceQueue.shift();
        this.#currentPiece = new Piece(typeIdOfNewPiece);
        const randomPieceTypeId = Math.floor(Math.random() * (images.length - 1)) + 1;
        this.#typeIdOfPieceQueue.push(randomPieceTypeId);
    }

    get board() {
        return this.#board;
    }

    get previousPieces() {
        return this.#previousPieces;
    }

    get currentPiece() {
        return this.#currentPiece;
    }

    getEmptyBoard() {
        return Array.from({ length: this.#rows }, () => Array(this.#columns).fill(0));
    }

    clear() {
        this.#board = this.getEmptyBoard();
    }

    reset() {
        this.clear();
        this.#typeIdOfPieceQueue = [1, 2, 3, 2];
        this.#previousPieces = [];
        this.spawn();
    }

    randomlySpawn() {
        
        this.spawn(randomPieceTypeId);
    }

    #isInside(x, y) {
        return (x >= 0 && this.#columns > x) &&
               (y >= 0 && this.#rows > y);
    }

    #isOccupied(x, y, mark) {
        return this.#board[y][x] > 0 && mark > 0;
    }

    validPosition(piece) {
        return piece.shape.every((row, dy) => {
            return row.every((mark, dx) => {
                const x = piece.x + dx;
                const y = piece.y + dy;
                return this.#currentPiece.isEmptyBlock(mark) || 
                       (this.#isInside(x, y) && this.#isOccupied(x, y, mark) === false);
            });
        });
    }

    validCurrentPiecePosition() {
        return this.validPosition(this.#currentPiece);
    }

    #isUnderHalf(piece) {
        return piece.y >= this.#rows / 2;
    }

    moveCurrentPiece(key) {
        const newPositionPiece = this.#currentPiece.getNewPositionPiece(key);
        if(this.validPosition(newPositionPiece) === true) {
            this.#currentPiece.move(key);
        }

        if(this.#isUnderHalf(this.#currentPiece)) {
            this.#currentPiece.shape.forEach((row, dy) => {
                row.forEach((mark, dx) => {
                    if(mark > 0) {
                        this.#board[this.#currentPiece.y + dy][this.#currentPiece.x + dx] = mark;
                    }
                });
            });

            this.#previousPieces.push(this.#currentPiece);

            this.spawn();
        }
    }

    moveDownPreviousPiece() {
        const newPreviousPieces = [];

        for (const piece of this.#previousPieces) {
            piece.shape.forEach((row, dy) => {
                row.forEach((mark, dx) => {
                    if(mark > 0) {
                        this.#board[piece.y + dy][piece.x + dx] = 0;
                    }
                });
            });

            const newPositionPiece = piece.getNewPositionPiece(keys.down);
            if(this.validPosition(newPositionPiece) === true) {
                piece.move(keys.down);
                newPreviousPieces.push(piece);
                piece.shape.forEach((row, dy) => {
                    row.forEach((mark, dx) => {
                        if(mark > 0) {
                            this.#board[piece.y + dy][piece.x + dx] = mark;
                        }
                    });
                });
            }
        }

        this.#previousPieces = newPreviousPieces;
    }

    #drawBoard() {
        this.#board.forEach((row, y) => {
            row.forEach((mark, x) => {
                if(mark > 0) {
                    context.drawImage(images[mark], x, y, 1, 1);
                }
            });
        });
    }

    draw() {
        this.#currentPiece.draw();
        this.#drawBoard();
    }
}