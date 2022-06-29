class Piece {
  constructor(board, color, startCoordinates) {
    this.board = board;
    this.color = color;
    this.startCoordinates = startCoordinates;
    this.currentCoordinates = startCoordinates;
    this.timesMoved = 0;
    this.validMoves = [];
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
    if (this.board.pinnedPieces[this.currentCoordinates.join(',')]) {
      res = res.filter(el => this.board.pinnedPieces[this.currentCoordinates.join(',')].includes(el.join(',')));
    }
    this.validMoves = res;
    return res;
  }
}




export const piecesObj = {
  'Pawn': class Pawn extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.enPassantable = false;
      this.doubleMove = null;
      this.enPassantMove = {};
    }

    move(newCoordinates) {
      const [currRow, currCol] = this.currentCoordinates;
      const [newRow, newCol] = newCoordinates;
      let oldPiece;

      if(newCoordinates.join(',') === this.doubleMove) {
        this.enPassantable = true;
      } else if (this.enPassantMove[newCoordinates.join(',')]) {
        oldPiece = this.enPassantMove[newCoordinates.join(',')];
        const [oldRow, oldCol] = oldPiece.currentCoordinates;
        this.board.grid[oldRow][oldCol] = null;
      } else {
        oldPiece = this.board.grid[newRow][newCol];
      }

      if (oldPiece) {
        this.board[`${oldPiece.color}Pieces`].delete(oldPiece);
        this.board.pieces.delete(oldPiece);
      }

      this.board.grid[currRow][currCol] = null;
      this.board.grid[newRow][newCol] = this;
      this.currentCoordinates = newCoordinates;
      this.timesMoved++;
      console.log(this.board.grid);
      this.board.update();
      return this
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
      this.doubleMove = null;
      this.enPassantMove = {};
      if(this.color === this.board.turn[0]) {
        this.enPassantable = false;
      }

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
          this.doubleMove = `${currRow+secondSquare},${currCol}`
        }
      }
      visibleSquares.forEach(square => {
        const [row, col] = square;
        // console.log(this.board.grid[row][currCol])
        // console.log(this.board.grid[row][currCol].enPassantable)
        // console.log(square)

        if(this.board.grid[row][col] && this.board.grid[row][col].color !== this.color) {
          res.push(square);

        } else if (this.board.grid[currRow][col] && this.board.grid[currRow][col].color !== this.color && this.board.grid[currRow][col].enPassantable) {
          res.push(square);
          this.enPassantMove[square.join(',')] = this.board.grid[currRow][col];
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
     if (this.board.pinnedPieces[this.currentCoordinates.join(',')]) {
      res = res.filter(el => this.board.pinnedPieces[this.currentCoordinates.join(',')].includes(el.join(',')));
     }
     console.log(this.doubleMove);
     console.log(this.enPassantMove);
      this.validMoves = res;
      return res;
    }
  },

  'Rook': class Rook extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    }

    getLineOfSight () {
      const res = [];

      for (let i = 0; i < this.directions.length; i++) {
        const [rowDir, colDir] = this.directions[i];
        let [row, col] = this.currentCoordinates;
        let checkArr = [`${row},${col}`];
        let currEl = null;

        while(this.board.grid[row+rowDir] && this.board.grid[row+rowDir][col+colDir] !== undefined && (currEl === null)) {
          row += rowDir;
          col += colDir;

          currEl = this.board.grid[row][col];
          res.push([row, col]);
          if (this.board.turn[1] === this.color) {
            if(`${row},${col}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
              this.board.checks.push([...checkArr]);
            } else {
              checkArr.push(`${row},${col}`);
            }
          }
        }
      }
      return res;
    }

  },

  'Knight': class Knight extends Piece {
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

  'Bishop': class Bishop extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[1,-1], [1, 1], [-1, -1], [-1, 1]];
    }
    getLineOfSight () {
      const res = [];

      for (let i = 0; i < this.directions.length; i++) {
        const [rowDir, colDir] = this.directions[i];
        let [row, col] = this.currentCoordinates;
        let checkArr = [`${row},${col}`];
        let currEl = null;

        while(this.board.grid[row+rowDir] && this.board.grid[row+rowDir][col+colDir] !== undefined && (currEl === null)) {
          row += rowDir;
          col += colDir;

          currEl = this.board.grid[row][col];
          res.push([row, col]);
          if (this.board.turn[1] === this.color) {
            if(`${row},${col}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
              this.board.checks.push([...checkArr]);
            } else {
              checkArr.push(`${row},${col}`);
            }
          }
        }
      }
      return res;
    }
  },

  'Queen': class Queen extends Piece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [1,-1], [1, 1], [-1, -1], [-1, 1]];
    }
    getLineOfSight () {
      const res = [];

      for (let i = 0; i < this.directions.length; i++) {
        const [rowDir, colDir] = this.directions[i];
        let [row, col] = this.currentCoordinates;
        let checkArr = [`${row},${col}`];
        let currEl = null;

        while(this.board.grid[row+rowDir] && this.board.grid[row+rowDir][col+colDir] !== undefined && (currEl === null)) {
          row += rowDir;
          col += colDir;

          currEl = this.board.grid[row][col];
          res.push([row, col]);
          if (this.board.turn[1] === this.color) {
            if(`${row},${col}` === this.board[`${this.board.turn[0]}King`].currentCoordinates.join(',')) {
              this.board.checks.push([...checkArr]);
            } else {
              checkArr.push(`${row},${col}`);
            }
          }
        }
      }
      return res;
    }
  },

  'King': class King extends Piece {
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
      res = res.filter(square => {
        if(this.board.opponentLineOfSight.has(square.join(','))) {
          return false;
        } else {
          return true;
        }
      });
      this.validMoves = res;
      return res;
    }

    checkForPins() {
      let pairs = [[['Bishop', 'Queen'], [[1,-1], [1, 1], [-1, -1], [-1, 1]]], [['Rook', 'Queen'], [[-1, 0], [1, 0], [0, -1], [0, 1]]]];
      let res = {};

      for (let i = 0; i < pairs.length; i++) {
        const [threats, directions] = pairs[i];
        for (let j = 0; j < directions.length; j++) {
          const [rowDir, colDir] = directions[j];
          let [row, col] = this.currentCoordinates;
          const pinnedMoves = [];
          const pieces = [];


          while(this.board.grid[row+rowDir] && this.board.grid[row+rowDir][col+colDir] !== undefined && pieces.length < 2) {
            row += rowDir;
            col += colDir;

            pinnedMoves.push(`${row},${col}`);

            if(this.board.grid[row][col]) {
              pieces.push(this.board.grid[row][col]);
            }
          }
          if((pieces.length === 2) && (pieces[0].color === this.color) && (pieces[1].color !== this.color) && (threats.includes(pieces[1].constructor.name))) {
            res[pieces[0].currentCoordinates.join(',')] = pinnedMoves;
          }
        }
      }
      return res;
    }
  },
}


// module.exports = pieces;
