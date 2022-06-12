class Piece {
  constructor(board, color, startCoordinates) {
    this.board = board;
    this.color = color;
    this.startCoordinates = startCoordinates;
    this.currentCoordinates = startCoordinates;
    this.timesMoved = 0;
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
    [this.board.turn[0], this.board.turn[1]] = [this.board.turn[1], this.board.turn[0]];
    return this
  }

  getValidMoves() {
    const res = [];
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
        const [row, col] = pair;
        if((currRow+row <= 7 && currRow+row >= 0) && (currCol+col <= 7 && currCol+col >= 0)) {
          res.push([currRow+row, currCol+col]);
        }
      });
      return res;
    }

    getValidMoves() {
      const res = [];
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

      while(this.board.grid[currRow-1] && (currEl === null)) {//top
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && (currEl === null)) {//bottom
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow][currCol-1] !== undefined && (currEl === null)) {//left
        currCol--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow][currCol+1] !== undefined && (currEl === null)) {//right
        currCol++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
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
        const [row, col] = pair;
        if((currRow+row <= 7 && currRow+row >= 0) && (currCol+col <= 7 && currCol+col >= 0)) {
          res.push([currRow+row, currCol+col]);
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

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol-1] !== undefined &&  (currEl === null)) {//top left
        currCol--;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol+1] !== undefined &&  (currEl === null)) {//top right
        currCol++;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol-1] !== undefined &&  (currEl === null)) {//bottom left
        currCol--;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol+1] !== undefined &&  (currEl === null)) {//bottom right
        currCol++;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
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

      while(this.board.grid[currRow-1] && (currEl === null)) {//top
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && (currEl === null)) {//bottom
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow][currCol-1] !== undefined && (currEl === null)) {//left
        currCol--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow][currCol+1] !== undefined && (currEl === null)) {//right
        currCol++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol-1] !== undefined &&  (currEl === null)) {//top left
        currCol--;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow-1] && this.board.grid[currRow-1][currCol+1] !== undefined &&  (currEl === null)) {//top right
        currCol++;
        currRow--;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol-1] !== undefined &&  (currEl === null)) {//bottom left
        currCol--;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      currEl = null;
      [currRow, currCol] = this.currentCoordinates;

      while(this.board.grid[currRow+1] && this.board.grid[currRow+1][currCol+1] !== undefined &&  (currEl === null)) {//bottom right
        currCol++;
        currRow++;
        currEl = this.board.grid[currRow][currCol];
        res.push([currRow, currCol]);
      }
      return res;
    }
  },

  'king': class King extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);
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

  },
}


// module.exports = pieces;