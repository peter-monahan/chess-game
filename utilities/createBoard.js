import { Board } from "../classes/board.js";
import { map } from "./map.js";
import { updateBoard } from "./updateBoard.js";

export function createBoard() {
  let board = new Board(map);
  console.log(board);

   const gridDiv = document.querySelector('#js-grid');
   const colors = ['white', 'black'];

   for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
         const square = document.createElement('div');

         square.id = `${row},${col}`;
         square.classList.add('tile', colors[0]);
         gridDiv.appendChild(square);
         [colors[0], colors[1]] = [colors[1], colors[0]];
      }
      [colors[0], colors[1]] = [colors[1], colors[0]];
   }
      updateBoard(board, gridDiv);
   return board
}
