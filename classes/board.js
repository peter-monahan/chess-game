// const piecesObj = require('./pieces.js');
import { piecesObj } from "./pieces.js";
export class Board {
  constructor(map) {
    this.grid = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    this.pieces = new Set();
    this.blackPieces = new Set();
    this.blackKing;
    this.whitePieces = new Set();
    this.whiteKing;
    this.opponentLineOfSight;
    this.checks = [];

    this.turn = ['white', 'black'];

    this.populate(map);
  }

  populate(map) {
    for (const rowKey in map) {
        const col = map[rowKey];

        for (const colKey in col) {
            const [color, type] = col[colKey].split(',');
            const piece = new piecesObj[type](this, color, [Number(rowKey), Number(colKey)]);
            this.grid[rowKey][colKey] = piece;
            this.pieces.add(piece);
            if (color === 'black') {
              this.blackPieces.add(piece);
            } else {
              this.whitePieces.add(piece);
            }

        }
    }
  }

  select(coordStr) {
    const [row, col] = coordStr.split(',');

    return this.grid[row][col];
  }

  update() {
    [this.turn[0], this.turn[1]] = [this.turn[1], this.turn[0]];
    this.checks = [];
    this.opponentLineOfSight = new Set();
    const king = this[`${this.turn[0]}King`];
    const [kingRow, kingCol] = king.currentCoordinates;
    this.grid[kingRow][kingCol] = null;

    this[`${this.turn[1]}Pieces`].forEach(piece => {
      let pieceSight = piece.getLineOfSight();
      pieceSight = pieceSight.forEach(coord => {
        let square = coord.join(',');
        this.opponentLineOfSight.add(square);
      });
    });

    console.log(this.checks);
    this.grid[kingRow][kingCol] = king;

  }
}

// const map = {
//   '0': {
//      '0': 'black,rook',
//      '1': 'black,knight',
//      '2': 'black,bishop',
//      '3': 'black,queen',
//      '4': 'black,king',
//      '5': 'black,bishop',
//      '6': 'black,knight',
//      '7': 'black,rook',
//       },
//   '1': {
//      '0': 'black,pawn',
//      '1': 'black,pawn',
//      '2': 'black,pawn',
//      '3': 'black,pawn',
//      '4': 'black,pawn',
//      '5': 'black,pawn',
//      '6': 'black,pawn',
//      '7': 'black,pawn'
//      },
//   '6': {
//      '0': 'white,pawn',
//      '1': 'white,pawn',
//      '2': 'white,pawn',
//      '3': 'white,pawn',
//      '4': 'white,pawn',
//      '5': 'white,pawn',
//      '6': 'white,pawn',
//      '7': 'white,pawn'
//      },
//   '7': {
//     '0': 'white,rook',
//     '1': 'white,knight',
//     '2': 'white,bishop',
//     '3': 'white,queen',
//     '4': 'white,king',
//     '5': 'white,bishop',
//     '6': 'white,knight',
//     '7': 'white,rook',
//      },
// }

// const board = new Board(map);


// board.grid[0][1].move([3, 3]);
// console.log(board);
// console.log(board.grid[3][3].getLineOfSight())
// board.pieces.forEach(piece => {
//   console.log(piece.constructor.name);
//   console.log(piece.getValidMoves());
// });
// console.log(board.grid[0][1].getLineOfSight());
// console.log(board.grid[1][1].getValidMoves());
// console.log(board.grid[1][1].move([3, 1]));
// console.log(board.grid[3][1].getValidMoves());

// module.exports = Board;
