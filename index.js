  import {createBoard} from './utilities/createBoard.js';
  import {select} from './utilities/select.js';


window.addEventListener('DOMContentLoaded', e => {
  let board = createBoard();
  select(board);
  console.log('loaded');
});
