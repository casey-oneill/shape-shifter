/**
 * @file This file defines the Cell class.
 * 
 * @author Casey O'Neill
 */
class Cell {
    constructor(type, r, c) {
        this.type = type;
        this.colour = cellTypes[type];
        this.empty = false;
        this.r = r;
        this.c = c;
    }

    moveVertical(increment) {
        if (matrix[this.r + increment][this.c].empty) {
            matrix[this.r][this.c] = generateEmptyCell();
            matrix[this.r + increment][this.c] = this;
            this.r = this.r + increment;
            return true;
        }
        return false;
    }

    drop() {
        for (var i = rows - this.r - 1; i > 0; i--) {
            if (this.moveVertical(i)) {
                return this;
            }
        }
        return generateEmptyCell();
    }

    draw(x, y) {
        if (!this.empty) {
            context.fillStyle = this.colour;
            context.fillRect(x, y, w - 1, w - 1);
        }
    }
}
