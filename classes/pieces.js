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
    return false
  }

  getValidMoves() {
    let res = [];
    const visibleSquares = this.getLineOfSight();

    visibleSquares.forEach(square => {
      const [row, col] = square;
      if(this.board.grid[row][col]) {
        if (this.board.grid[row][col].color !== this.color) {
          res.push(square.join(','));
        }
      } else {
        res.push(square.join(','));
      }
    });

    if (this.board.checks.length) {
      if (this.board.checks.length > 1) {
        res = [];
      } else {
        const valid = this.board.checks[0];
        res = res.filter(el => valid.includes(el));
      }
    }
    if (this.board.pinnedPieces[this.currentCoordinates.join(',')]) {
      res = res.filter(el => this.board.pinnedPieces[this.currentCoordinates.join(',')].includes(el));
    }
    this.validMoves = res;
    return res;
  }
}

class LongRangePiece extends Piece {
  constructor(board, color, startCoordinates) {
    super(board, color, startCoordinates);
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
}

class ShortRangePiece extends Piece {
  constructor(board, color, startCoordinates) {
    super(board, color, startCoordinates);
  }

  getLineOfSight() {
    let res = [];
    let [currRow, currCol] = this.currentCoordinates;

    this.pairs.forEach(pair => {
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
}



export const piecesObj = {
  'Pawn': class Pawn extends ShortRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.enPassantable = false;
      this.doubleMove = null;
      this.enPassantMove = {};
      if (this.color === 'black') {
        this.pairs = [[1, -1], [1, 1]]
      } else if (this.color === 'white') {
        this.pairs = [[-1, -1], [-1, 1]]
      }
    }

    move(newCoordinates) {
      let upgradeBool = false;
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

      if(this.color === 'white' && this.currentCoordinates[0] === 0) {
        upgradeBool = true;
      } else if (this.color === 'black' && this.currentCoordinates[0] === 7){
        upgradeBool = true;
      }

      return upgradeBool;
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
        res.push([currRow+firstSquare, currCol].join(','));
        if(this.timesMoved === 0 && this.board.grid[currRow+secondSquare][currCol] === null) {
          res.push([currRow+secondSquare, currCol].join(','));
          this.doubleMove = `${currRow+secondSquare},${currCol}`
        }
      }
      visibleSquares.forEach(square => {
        const [row, col] = square;

        if(this.board.grid[row][col] && this.board.grid[row][col].color !== this.color) {
          res.push(square.join(','));

        } else if (this.board.grid[currRow][col] && this.board.grid[currRow][col].color !== this.color && this.board.grid[currRow][col].enPassantable) {
          res.push(square.join(','));
          this.enPassantMove[square.join(',')] = this.board.grid[currRow][col];
        }

      });
      if (this.board.checks.length) {
        if (this.board.checks.length > 1) {
          res = [];
        } else {
          const valid = this.board.checks[0];
          res = res.filter(el => valid.includes(el));
        }
      }
     if (this.board.pinnedPieces[this.currentCoordinates.join(',')]) {
      res = res.filter(el => this.board.pinnedPieces[this.currentCoordinates.join(',')].includes(el));
     }

      this.validMoves = res;
      return res;
    }
  },

  'Rook': class Rook extends LongRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    }
  },

  'Knight': class Knight extends ShortRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.pairs = [[-2, -1], [-2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2], [2, -1], [2, 1]];
    }
  },

  'Bishop': class Bishop extends LongRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[1,-1], [1, 1], [-1, -1], [-1, 1]];
    }
  },

  'Queen': class Queen extends LongRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [1,-1], [1, 1], [-1, -1], [-1, 1]];
    }
  },

  'King': class King extends ShortRangePiece {
    constructor(board, color, startCoordinates) {
      super(board, color, startCoordinates);

      this.castleMove = {};
      this.board[`${color}King`] = this;
      this.pairs = [[1,-1], [1, 1], [-1, -1], [-1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
    }

    move(newCoordinates) {
      const [currRow, currCol] = this.currentCoordinates;
      const [newRow, newCol] = newCoordinates;
      const oldPiece = this.board.grid[newRow][newCol];

      if(this.castleMove[newCoordinates.join(',')]) {
        const rook = this.castleMove[newCoordinates.join(',')].piece;
        const [rookRow, rookCol] = this.castleMove[newCoordinates.join(',')].spot;
        const [oldRookRow, oldRookCol] = rook.currentCoordinates;

        this.board.grid[oldRookRow][oldRookCol] = null;
        this.board.grid[rookRow][rookCol] = rook;
        rook.currentCoordinates = this.castleMove[newCoordinates.join(',')].spot;
        rook.timesMoved++;
      }

      if (oldPiece) {
        this.board[`${oldPiece.color}Pieces`].delete(oldPiece);
        this.board.pieces.delete(oldPiece);
      }

      this.board.grid[currRow][currCol] = null;
      this.board.grid[newRow][newCol] = this;
      this.currentCoordinates = newCoordinates;
      this.timesMoved++;
      return false;
    }

    getValidMoves() {
      this.castleMove = {};
      let res = [];
      const visibleSquares = this.getLineOfSight();

      visibleSquares.forEach(square => {
        const [row, col] = square;
        if( !(this.board.grid[row][col]) || (this.board.grid[row][col].color !== this.color) ) {
          res.push(square.join(','));
        }
      });

      res = res.filter(square => {
        if(this.board.opponentLineOfSight.has(square)) {
          return false;
        } else {
          return true;
        }
      });

      if (this.timesMoved === 0) {
        const leftRight = [-1, 1];

        leftRight.forEach(direction => {
          let [row, col] = this.currentCoordinates;
          const castleMove = `${row},${(direction * 2) + col}`;
          const dependantMove = `${row},${direction + col}`;
          let foundPiece;

          while(this.board.grid[row][col+direction] !== undefined && !foundPiece) {
            col += direction;

            if(this.board.grid[row][col]) {
              foundPiece = this.board.grid[row][col];
            }
          }
          if(foundPiece && foundPiece.constructor.name === 'Rook' && foundPiece.timesMoved === 0) {
            if(res.includes(dependantMove) && !(this.board.opponentLineOfSight.has(castleMove))) {
              this.castleMove[castleMove] = {piece: foundPiece, spot: dependantMove.split(',').map(el => Number(el))};
              res.push(castleMove);
            }
          }

        });
      }


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
