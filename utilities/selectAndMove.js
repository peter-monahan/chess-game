import { updateBoard } from "./updateBoard.js";

let selected = null; // Variable that will contain information about the selected piece. Null if no piece is selected.

export function selectAndMove(board) {
  const gridDiv = document.querySelector('.grid-area'); // Grabbing the chess board container.


      gridDiv.addEventListener('click', e => { // Adding an event listener for clicks on the chess board.
         const targ = e.target; // Grabbing the 'target' of the click and saving it to a variable.

        if (targ.dataset.valid === 'true'){
            selected.pieceObj.move(targ.id.split(',').map(el => Number(el)));
            updateBoard(board, gridDiv);
            selected = null;
         } else {
          updateBoard(board, gridDiv);
          if ((targ.dataset.piece && targ.dataset.piece.startsWith(board.turn[0])) && (!selected || selected.element !== targ)) {
            selected = null;
            targ.dataset.selected = 'true'; // Update the html elements data-selected to a string of 'true'.

             const piece = board.select(targ.id); // Select the piece from the board object.

             let validMoves = piece.validMoves; // Get the valid moves of the piece.

            //  validMoves = validMoves.map(el => el.join(',')); // Change each valid move into a string so as to target the grid id's.

             validMoves.forEach(id => { // Update each valid html square's data-valid to a string of 'true'.
               const validSquare = document.getElementById(id);
               validSquare.dataset.valid = 'true';
             });

             selected = { // Save important information to the 'selected' variable.
               'pieceObj': piece,
               'pieceValidMoves': validMoves,
               'element': targ
              };
          } else {
          selected = null;
          }
         }
     });
}
