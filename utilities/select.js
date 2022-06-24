let selected = null; // Variable that will contain information about the selected piece. Null if no piece is selected.

export function select(board) {
  const gridDiv = document.querySelector('.grid-area'); // Grabbing the chess board container.


      gridDiv.addEventListener('click', e => { // Adding an event listener for clicks on the chess board.
         const targ = e.target; // Grabbing the 'target' of the click and saving it to a variable.

        if(!selected) { // If no piece is selected.

           if (targ.dataset.piece && targ.dataset.piece.startsWith(board.turn[0])) { // If it is the clicked pieces turn.
             targ.dataset.selected = 'true'; // Update the html elements data-selected to a string of 'true'.

             const piece = board.select(targ.id); // Select the piece from the board object.

             let validMoves = piece.validMoves; // Get the valid moves of the piece.

             validMoves = validMoves.map(el => el.join(',')); // Change each valid move into a string so as to target the grid id's.

             validMoves.forEach(id => { // Update each valid html square's data-valid to a string of 'true'.
               const validSquare = document.getElementById(id);
               validSquare.dataset.valid = 'true';
             });

             selected = { // Save important information to the 'selected' variable.
               'element': targ,
               'pieceObj': piece,
               'pieceValidMoves': validMoves
              };
              console.log(selected);
           }
        } else if (targ.dataset.valid === 'true'){
          let newPiece = selected.element.dataset.piece;
          selected.pieceObj.move(targ.id.split(',').map(el => Number(el)));
          selected.pieceValidMoves.forEach(id => {
            const validSquare = document.getElementById(id);
            validSquare.dataset.valid = 'false';
          });
          if (targ.dataset.piece){

            selected.element.dataset.piece = '';
            targ.dataset.piece = newPiece;

            selected.element.dataset.selected = 'false';
            selected = null;
           } else if (targ.classList.contains('tile')) {

             targ.dataset.piece = newPiece;
             selected.element.dataset.piece = '';

             selected.element.dataset.selected = 'false';
             selected = null;
           }
           gridDiv.dataset.turn = board.turn[0];
         } else {
          selected.pieceValidMoves.forEach(id => {
            const validSquare = document.getElementById(id);
            validSquare.dataset.valid = 'false';
          });
          selected.element.dataset.selected = 'false';
          selected = null;
         }
     });
}
