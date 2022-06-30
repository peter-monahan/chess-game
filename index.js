  import {createBoard} from './utilities/createBoard.js';
  import {selectAndMove} from './utilities/selectAndMove.js';


window.addEventListener('DOMContentLoaded', e => {
  let board = createBoard();
  selectAndMove(board);
});
