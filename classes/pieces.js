class Piece {
  constructor(board, color, startCoordinates) {
    this.board = board;
    this.color = color;
    this.startCoordinates = startCoordinates;
    this.currentCoordinates = startCoordinates;
    this.timesMoved = 0;
    this.validMoves = null;
  }

  move(newCoordinates) {
    const [currRow, currCol] = this.currentCoordinates;
    const [newRow, newCol] = newCoordinates;
    const oldPiece = this.board.grid[newRow][newCol];

    if (oldPiece) {
      this.board[`${oldPiece.color}Pieces`].delete(oldPiece);
      this.board.pieces.delete(oldPiece);
    }

    this.board.grid[currRow][currCol] = null;
    this.board.grid[newRow][newCol] = this;
    this.currentCoordinates = newCoordinates;
    this.timesMoved++;
    this.board.update();
    return this
  }

  getValidMoves() {
    let res = [];
    const visibleSquares = this.getLineOfSight();

    visibleSquares.forEach(square => {
      const [row, col] = square;
      if(this.board.grid[row][col]) {
        if (this.board.grid[row][col].color !== this.color) {
          res.push(square);
        }
      } else {
        res.push(square);
      }
    });

    if (this.board.checks.length) {
      if (this.board.checks.length > 1) {
        res = [];
      } else {
        const valid = this.board.checks[0];
        res = res.filter(el => valid.indexOf(el.join(',')) !== -1);
      }
    }
    return res;
  }
}




export const piecesObj = {
  'pawn': class Pawn extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
    }

    getLineOfSight() {
      let res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let pairs;
      if (this.color === 'black') {
        pairs = [[1, -1], [1, 1]]
      } else if (this.color === 'white') {
        pairs = [[-1, -1], [-1, 1]]
      }

      pairs.forEach(pair => {
        let [row, col] = pair;
        row+=currRow;
        col+=currCol;

        if((row <= 7 && row >= 0) && (col <= 7 && col >= 0)) {
          if ((this.board.turn[1] === this.color) && (`${row},${col}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(','))) {
            this.board.checks.push([`${currRow},${currCol}`]);
          }
          res.push([row, col]);
        }
      });
      return res;
    }

    getValidMoves() {
      let res = [];
      const visibleSquares = this.getLineOfSight();
      const [currRow, currCol] = this.currentCoordinates;
      let firstSquare;
      let secondSquare;
      if (this.color === 'black') {
        firstSquare = 1;
        secondSquare = 2;
      } else if (this.color === 'white') {
        firstSquare = -1;
        secondSquare = -2;
      }

      if(this.board.grid[currRow+firstSquare][currCol] === null) {
        res.push([currRow+firstSquare, currCol]);
        if(this.board.grid[currRow+secondSquare][currCol] === null && this.timesMoved === 0) {
          res.push([currRow+secondSquare, currCol]);
        }
      }
      visibleSquares.forEach(square => {
        const [row, col] = square;
        if(this.board.grid[row][col]) {
          if (this.board.grid[row][col].color !== this.color) {
            res.push(square);
          }
        }

      });
      if (this.board.checks.length) {
        if (this.board.checks.length > 1) {
          res = [];
        } else {
          const valid = this.board.checks[0];
          res = res.filter(el => valid.indexOf(el.join(',')) !== -1);
        }
      }
      return res;
    }
  },

  'rook': class Rook extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
    }

    getLineOfSight () {
      const res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let currEl = null;
      let checkArr = [`${currRow},${currCol}`];

      // if (this.board.turn[1] === this.color) {
      //   let checkArr = [];
      // }
      while(this.board.grid[currRow-1] && (currEl === null)) {//top
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow+1] && (currEl === null)) {//bottom
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow][currCol-1] !== undefined && (currEl === null)) {//left
        currCol--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow][currCol+1] !== undefined && (currEl === null)) {//right
        currCol++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      return res;
    }

  },

  'knight': class Knight extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
    }

    getLineOfSight() {
      let res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let pairs = [[-2, -1], [-2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2], [2, -1], [2, 1]];
      pairs.forEach(pair => {
        let [row, col] = pair;
        row+=currRow;
        col+=currCol;
        if((row <= 7 && row >= 0) && (col <= 7 && col >= 0)) {
          if ((this.board.turn[1] === this.color) && (`${row},${col}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(','))) {
            this.board.checks.push([`${currRow},${currCol}`]);
          }
          res.push([row, col]);
        }
      });
      return res;
    }
  },

  'bishop': class Bishop extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
    }
    getLineOfSight () {
      const res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let currEl = null;
      let checkArr = [`${currRow},${currCol}`];


      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol-1] !== undefined &&  (currEl === null)) {//top left
        currCol--;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];


      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol+1] !== undefined &&  (currEl === null)) {//top right
        currCol++;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];


      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol-1] !== undefined &&  (currEl === null)) {//bottom left
        currCol--;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];


      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol+1] !== undefined &&  (currEl === null)) {//bottom right
        currCol++;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      return res;
    }
  },

  'queen': class Queen extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
    }
    getLineOfSight () {
      const res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let currEl = null;
      let checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow-1] && (currEl === null)) {//top
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow+1] && (currEl === null)) {//bottom
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow][currCol-1] !== undefined && (currEl === null)) {//left
        currCol--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow][currCol+1] !== undefined && (currEl === null)) {//right
        currCol++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol-1] !== undefined &&  (currEl === null)) {//top left
        currCol--;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol+1] !== undefined &&  (currEl === null)) {//top right
        currCol++;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol-1] !== undefined &&  (currEl === null)) {//bottom left
        currCol--;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;
      checkArr = [`${currRow},${currCol}`];

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol+1] !== undefined &&  (currEl === null)) {//bottom right
        currCol++;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
      return res;
    }
  },

  'king': class King extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.board[`${color}King`] = this;
    }
    getLineOfSight() {
      let res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let pairs = [[1,-1], [1, 1], [-1, -1], [-1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];

      pairs.forEach(pair => {
        const [row, col] = pair;
        if((currRow+row <= 7 && currRow+row >= 0) && (currCol+col <= 7 && currCol+col >= 0)) {
          res.push([currRow+row, currCol+col]);
        }
      });
      return res;
    }

    getValidMoves() {
      let res = [];
      const visibleSquares = this.getLineOfSight();

      visibleSquares.forEach(square => {
        const [row, col] = square;
        if(this.board.grid[row][col]) {
          if (this.board.grid[row][col].color !== this.color) {
            res.push(square);
          }
        } else {
          res.push(square);
        }
      });
      console.log(this.board.opponentLineOfSight);
      res = res.filter(square => {
        console.log(square.join(','));
        if(this.board.opponentLineOfSight.has(square.join(','))) {
          return false;
        } else {
          return true;
        }
      });
      return res;
    }

    checkForPins() {
      let pinnedMoves;
      const res = [];
      let [currRow, currCol] = this.currentCoordinates;
      let currEl = null;
      let first = true;

      while(this.board.grid[currRow-1] && (currEl === null)) {//top
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
        if (this.board.turn[1] === this.color) {
          if(`${currRow},${currCol}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
            this.board.checks.push([...checkArr]);
          } else {
            checkArr.push(`${currRow},${currCol}`);
          }
        }
      }
    }
  },
}


// module.exports = pieces;
