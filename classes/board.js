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

    this.piecesObj = piecesObj;
    this.pieces = new Set();
    this.blackPieces = new Set();
    this.blackKing;
    this.whitePieces = new Set();
    this.whiteKing;
    this.opponentLineOfSight = new Set();
    this.checks = [];
    this.pinnedPieces = {};

    this.turn = ['white', 'black'];

    this.populate(map);
    this.whitePieces.forEach(piece => piece.getValidMoves());
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
    this.pinnedPieces = king.checkForPins();
    this.grid[kingRow][kingCol] = null;

    this[`${this.turn[1]}Pieces`].forEach(piece => {
      let pieceSight = piece.getLineOfSight();

      pieceSight = pieceSight.forEach(coord => {
        let square = coord.join(',');
        this.opponentLineOfSight.add(square);
      });
    });

    this.grid[kingRow][kingCol] = king;

    this[`${this.turn[0]}Pieces`].forEach(piece => piece.getValidMoves())
  }
}

// module.exports = Board;
