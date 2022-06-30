export function updateBoard(boardObj, htmlBoard) {
  const grid = boardObj.grid;
  const tiles = htmlBoard.children;

  htmlBoard.dataset.turn = boardObj.turn[0];

  for (let i = 0; i < tiles.length; i++) {
     const tile = tiles[i];
     const [row, col] = tile.id.split(',');
     const piece = grid[row][col];

     tile.dataset.selected = 'false';
     tile.dataset.valid = 'false';
     if(piece){
        tile.dataset.piece = `${piece.color},${piece.constructor.name}`;
     } else {
      tile.dataset.piece = '';
     }
  }
}
