import { map } from "./map.js";

export function addPieces() {
  const board = document.querySelector('.grid-area');
  const tiles = board.children;

  for (let i = 0; i < tiles.length; i++) {
     const tile = tiles[i];
     const [row, col] = tile.id.split(',');

     if(map[row] && map[row][col]){
        tile.dataset.piece = map[row][col];
     }
  }
}
