/**
 * An HTML5 and JavaScript Columns clone.
 * 
 * @file This file defines the main Game class.
 * 
 * @author Casey O'Neill
 */

const canvas = document.getElementById('scene');
const context = canvas.getContext('2d');
const rows = 13;
const cols = 6;
const w = 40;

const cellTypes = {
    1: 'red',
    2: 'blue',
    3: 'purple',
    4: 'yellow',
    5: 'orange',
    6: 'green'
}

let matrix;
let col;
let gameLoopInterval;
let fallLoopInterval;

class Game {
    init() {
        this.game = true;
        this.initMatrix();

        col = generateColumn();
        this.registerInputs();

        gameLoopInterval = setInterval(this.gameLoop, 1000/60);
        fallLoopInterval = setInterval(this.fallLoop, 1000);
    }

    initMatrix() {
        matrix = [];

        for (let i = -2; i < rows; i++) {
            matrix[i] = [];

            for (let j = 0; j < cols; j++) {
                matrix[i][j] = generateEmptyCell();
            }
        }
    }

    gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        col.trackCells();
        drawMatrix();
    }

    fallLoop() {
        if (!col.moveVertical(1)) {
            deleteMatchingCells(col.cells);
            
            // TODO: Check for matches on changed cells
            pullMatrix();

            col.drop();
            if (col.r < 0) {
                this.gameOver();
            } else {
                col = this.generateColumn();
            }
        }
    }

    registerInputs() {
        document.addEventListener('keydown', function (e) {
            switch (e.which) {
                case 37:
                    // left arrow key (move left)
                    col.moveHorizontal(-1);
                    break;
                case 39:
                    // right arrow key (move right)
                    col.moveHorizontal(1);
                    break;
                case 40:
                    // down arrow key (drop)
                    col.drop();
                    break;
                case 38:
                    // up arrow key
                    col.shuffle();
                    break;
            }
        });
    }
}

function gameOver() {
    clearInterval(gameLoopInterval);
    clearInterval(fallLoopInterval);
}

function drawMatrix() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!matrix[i][j].empty) {
                matrix[i][j].draw(j * w + 1, i * w);
            }
        }
    }
}

function pullMatrix() {
    cellsChanged = [];
    for (let i = rows-1; i >= 0; i--) {
        for (let j = 0; j < cols; j++ ) {
            if (!matrix[i][j].empty) {
                let result = matrix[i][j].drop();
                if (!result.empty) {
                    cellsChanged.push(result);
                }
            }
        }
    }

    return cellsChanged;
}

function deleteMatchingCells(cells) {
    let toRemove = [];

    for (let i = 0; i < cells.length; i++) {
        toRemove = toRemove.concat(getAdjacent(cells[i]));
    }

    for (let i = 0; i < toRemove.length; i++) {
        let element = toRemove[i];
        matrix[element[0]][element[1]] = generateEmptyCell();
    }
}

function getAdjacent(cell) {
    let toRemove = [];
    toRemove = toRemove.concat(getAdjacentHoriz(cell));
    toRemove = toRemove.concat(getAdjacentVertic(cell));
    toRemove = toRemove.concat(getAdjacentDiagLeft(cell));
    toRemove = toRemove.concat(getAdjacentDiagRight(cell));

    return toRemove;
}

function getAdjacentDiagLeft(cell) {
    let toRemove = [];
    let sequence = 1;
    let result = getAdjacentIn(cell, -1, -1, sequence);
    toRemove = toRemove.concat(result[0]);
    sequence = result[1];
    result = getAdjacentIn(cell, 1, 1, sequence);
    toRemove = toRemove.concat(result[0]);

    if (result[1] >= 3) {
        return toRemove;
    } else {
        return [];
    }
}

function getAdjacentDiagRight(cell) {
    let toRemove = [];
    let sequence = 1;
    let result = getAdjacentIn(cell, -1, 1, sequence);
    toRemove = toRemove.concat(result[0]);
    sequence = result[1];
    result = getAdjacentIn(cell, 1, -1, sequence);
    toRemove = toRemove.concat(result[0]);

    if (result[1] >= 3) {
        return toRemove;
    } else {
        return [];
    }
}

function getAdjacentVertic(cell) {
    let toRemove = [];
    let sequence = 1;
    let result = getAdjacentIn(cell, -1, 0, sequence);
    toRemove = toRemove.concat(result[0]);
    sequence = result[1];
    result = getAdjacentIn(cell, 1, 0, sequence);
    toRemove = toRemove.concat(result[0]);

    if (result[1] >= 3) {
        return toRemove;
    } else {
        return [];
    }
}

function getAdjacentHoriz(cell) {
    let toRemove = [];
    let sequence = 1;
    let result = getAdjacentIn(cell, 0, -1, sequence);
    toRemove = toRemove.concat(result[0]);
    sequence = result[1];
    result = getAdjacentIn(cell, 0, 1, sequence);
    toRemove = toRemove.concat(result[0]);

    if (result[1] >= 3) {
        return toRemove;
    } else {
        return [];
    }
}

function getAdjacentIn(cell, roff, coff, sequence) {
    let toRemove = [];
    let matching = true;
    
    let r = cell.r;
    let c = cell.c;
    
    while (matching) {
        r = r + roff;
        c = c + coff;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (isMatch(cell.type, r, c)) {
                toRemove.push([r, c]);
                sequence++;
            } else {
                matching = false;
            }
        } else {
            matching = false;
        }
    }

    toRemove.push([cell.r, cell.c]);
    return [toRemove, sequence];
}

function isMatch(type, r2, c2) {
    if (!matrix[r2].empty && !matrix[r2][c2].empty) {
        if (!matrix[r2][c2].empty) {
            if (matrix[r2][c2].type === type) {
                return true;
            }
        }
    }
    return false;
}

function generateColumn() {
    return new Column(this.generateCell(), this.generateCell(), this.generateCell());
}

function generateCell() {
    return new Cell(randi(1, 6));
}

function generateEmptyCell() {
    let cell = new Cell('white');
    cell.empty = true;
    return cell;
}

/**
 * returns a random integer within range [min, max]
 * @see https://stackoverflow.com/a/1527820/2124254
 */
function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
