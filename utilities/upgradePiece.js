import { updateBoard } from "./updateBoard.js";

export function upgradePiece(gridDiv, piece) {
  const board = piece.board;
  const pieceObj = board.piecesObj;
  const [row, col] = piece.currentCoordinates;
  const color = piece.color;
  const pieces = ['Rook', 'Knight', 'Bishop', 'Queen'];
  const upgradeDiv = document.createElement('div');
  upgradeDiv.classList.add('upgrade');

  const upgradeChildDiv = document.createElement('div');
  upgradeChildDiv.classList.add('upgradeChild');

  pieces.forEach(pieceStr => {
    const pieceElement = document.createElement('div');
    pieceElement.classList.add('tile');
    pieceElement.dataset.piece = `${color},${pieceStr}`;
    upgradeChildDiv.appendChild(pieceElement);
  });
  upgradeDiv.appendChild(upgradeChildDiv);
  document.body.appendChild(upgradeDiv);

  upgradeChildDiv.addEventListener('click', event => {
    const targ = event.target;
    const newPieceType = targ.dataset.piece.split(',')[1];
    const newPiece = new pieceObj[newPieceType](board, color, piece.currentCoordinates);
    board.grid[row][col] = newPiece;
    board[`${color}Pieces`].delete(piece);
    board.pieces.delete(piece);
    board[`${color}Pieces`].add(newPiece);
    board.pieces.add(newPiece);
    upgradeDiv.remove()
    board.update();
    updateBoard(board, gridDiv);
  });
}
