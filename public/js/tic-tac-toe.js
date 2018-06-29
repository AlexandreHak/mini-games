const BOARD = document.getElementById('board');
const CELLS = document.getElementsByClassName('cell');
const FEEDBACK = document.getElementById('endgame__feedback');
const REPLAY_BTN = document.getElementById('endgame__replay-btn');

/**
 * @see https://www.youtube.com/watch?v=P2TcQ3h0ipQ
 */
let ticTacToe = {
  humanPlayer: 'O',
  computerPlayer: 'X',
  board: [],
  winCombos: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],

  start: function() {
    // addeventlistener on board
    BOARD.addEventListener('click', function(e) {
      console.log(e.target);
      
    });
    // human player start the game ?
  },
  evaluate: function() {

  },
  replay: function() {
    // set none FEEDBACK to none
    // add class to every cells if not 
  }

};

ticTacToe.start();