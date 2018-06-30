const BOARD = document.getElementById('board');
const CELLS = document.getElementsByClassName('cell');
const END_PANEL = document.getElementById('endgame');
const FEEDBACK = document.getElementById('endgame__feedback');
const REPLAY_BTN = document.getElementById('endgame__replay-btn');

/**
 * @see https://www.youtube.com/watch?v=P2TcQ3h0ipQ
 */
let ticTacToe = {
  humanPlayer: 'O',
  computerPlayer: 'X',
  /** @type {boolean} Random start */
  playerTurn: Math.random() <= 0.5,
  /** @type {array} Board tracking where value means cell is empty */
  board: Array.from(Array(9).keys()),
  /** @type {object} Players's tokens positions */
  playersPositions: {
    humanPlayer: [],
    computerPlayer: []
  },
  /** @type {number} Determine when checking for winner and game ending */
  turnCount: 0,
  /** @type {array} All winning combinations */
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
  /**
   * Start the game
   * Reset the game if clicked on replay
   * @return {undefined}
   */
  start: function() {
    this.newBoard();
  
    /** @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Multiple_identical_event_listeners */
    BOARD.addEventListener('click', function(e) {
      ticTacToe.turnClick(e.target);
      
      // make computer play here ?
      // if computer turn then make him play
      if (!this.playerTurn) {
        console.log('computer play');
        ticTacToe.computerTurn();
        // toggle turn again
      }
    });

    // human player start the game ?
    // computer make him play
    if (!this.playerTurn) {
      console.log('computer played first');
      // make computer play
      this.computerTurn();
    }
  },
  /**
   * Clear board
   * Make sure that element has class 'empty'
   * @return {undefined}
   */
  newBoard: function() {
    let cellsLength = CELLS.length;

    for (let i = 0; i < cellsLength; i++) {
      CELLS[i].innerText = '';

      if (!CELLS[i].classList.contains('empty')) {
        CELLS[i].classList.add('empty');
      }
    }
  },
  /**
   * Place player's token
   * Remove click ability
   * @param {object} cell
   * @return {undefined}
   */
  turnClick: function(cell) {
    // Check for valid (empty) cell
    if (cell.classList.contains('empty')) {
      cell.classList.remove('empty');

      this.turnCount++;
      
      // Store token position in playersPosition object
      this.recordPosition(cell.id);

      // get current player's token
      let playerToken = this.whosTurn();

      // print token on cell
      cell.innerText = playerToken;

      // record token to board
      this.board[cell.id] = playerToken;
      
      // check game status and victory
      this.status();

      // toggle turn
      this.playerTurn = !this.playerTurn;
    }
  },
  /**
   * Record token position
   * @return {undefined}
   */
  recordPosition: function(tokenIndex) {
    if (this.playerTurn) {
      this.playersPositions.humanPlayer.push(+tokenIndex);
    } else {
      this.playersPositions.computerPlayer.push(+tokenIndex);
    }
  },
  /**
   * Tell who's turn it is
   * @return {string} turn Either 'X' or 'O' 
   */
  whosTurn: function() {
    let turn = this.playerTurn ? this.humanPlayer : this.computerPlayer;
    
    return turn;
  },
  computerTurn: function() {
    // determine which cell to play
    for (let i = 0; i < 9; i++) {
      if (typeof this.board[i] === 'number') {
        this.turnClick(CELLS[i]);
        break;    
      }
    }
    // use minmax

  },
  /**
   * @see https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
   */
  minmax: function() {
    // get empty cells
    
  },
  /**
   * List all avaible cells
   * @return {array}
   */
  getEmptyCells: function() {
    return this.board.filter((boardValue) => {
      return typeof boardValue === 'number';
    });
  },
  /**
   * Check winner
   * Check if game is ended
   * @return {undefined}
   */
  status: function() {
    // When winning is possible
    if (this.turnCount >= 5) {
      if (this.checkWin()) {
        this.gameOver(false);
      }
    }

    // When game is over and is draw
    if (this.turnCount === 9) {
      this.gameOver(true);
    }
  },
  /**
   * Check if players has won the game
   * @return {boolean|undefined} whether won or not
   */
  checkWin: function() {
    let isVictory = false;
    let playerTokens = this.playerTurn ? this.playersPositions.humanPlayer : this.playersPositions.computerPlayer;
    
    /**
     * Check for each win combo if current player played one of them
     * Which would mean that current player won
     */
    this.winCombos.forEach((winCombo) => {
      let isWon = winCombo.every((winIndex) => {
        return playerTokens.includes(winIndex);
      });
      
      if (isWon) {
        isVictory = true;
        // can't break forEach here
      }
    });

    return isVictory;
  },
  /**
   * Display end game panel and propose to replay
   * @param {boolean} isDraw
   * @return {undefined}
   */
  gameOver: function(isDraw = true) {
    END_PANEL.style.display = 'flex';

    if (isDraw) {
      FEEDBACK.innerText = 'It\'s a tie !';
    } else {
      FEEDBACK.innerText = this.playerTurn ? 'You Won !' : 'You lose !';
    }

    REPLAY_BTN.addEventListener('click', function() {
      window.location.reload();
    });
  }

};

ticTacToe.start();