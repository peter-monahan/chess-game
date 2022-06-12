let selected = null;

export function select(board) {
  const gridDiv = document.querySelector('.grid-area');


      gridDiv.addEventListener('click', e => {
        console.log(board.grid);
         const targ = e.target;

        if(!selected) {
           if (targ.dataset.piece.startsWith(board.turn[0])) {
             targ.dataset.selected = 'true';
             const piece = board.select(targ.id);
             let validMoves = piece.getValidMoves();
             validMoves = validMoves.map(el => el.join(','));
             validMoves.forEach(id => {
               const validSquare = document.getElementById(id);
               validSquare.dataset.valid = 'true';
             });
             selected = {
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
