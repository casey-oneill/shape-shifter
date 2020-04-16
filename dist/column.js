/**
 * @file This file defines the Column class.
 * 
 * @author Casey O'Neill
 */
class Column {
    constructor(r1, r2, r3) {
        this.cells = [r1, r2, r3];
        this.r = -2;
        this.c = 2;
        this.length = 3;
    }

    moveHorizontal(increment) {
        if ((increment > 0 && this.c < 5) || (increment < 0 && this.c > 0)) {
            if (matrix[this.r + 2][this.c + increment].empty) {
                this.clear();
                this.c = this.c + increment;
            }
        }
    }

    moveVertical(increment) {
        if (this.r < 10 && matrix[this.r + 2 + increment][this.c].empty) {
            this.clear();
            this.r = this.r + increment;
            return true;
        }
        return false;
    }

    drop() {
        for (var i = rows - this.length - this.r; i > 0; i--) {
            if (this.moveVertical(i)) {
                return true;
            }
        }
        return false;
    }

    shuffle() {
        var temp = this.cells[0];
        this.cells[0] = this.cells[2];
        this.cells[2] = this.cells[1];
        this.cells[1] = temp;
    }

    clear() {
        for (let i = 0; i < this.length; i++) {
            matrix[this.cells[i].r][this.cells[i].c] = generateEmptyCell();
        }
    }

    trackCells() {
        for (let i = 0; i < this.length; i++) {
            let r = this.r + i;
            let c = this.c;
            matrix[r][c] = this.cells[i];
            this.cells[i].r = r;
            this.cells[i].c = c;
        }
    }
}
