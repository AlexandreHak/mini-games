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
  /** @type {boolean} Game ended or not */
  continue: true,
  /**
   * Start the game
   * Reset the game if clicked on replay
   * @return {undefined}
   */
  start: function() {
    this.newBoard();
  
    /** @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Multiple_identical_event_listeners */
    BOARD.addEventListener('click', function(e) {
      // Check for valid empty cell
      if (e.target.classList.contains('empty')) {
        ticTacToe.turnClick(e.target);
        
        // make computer play here ?
        // if computer turn then make him play
        if (!this.playerTurn && ticTacToe.continue) {
          console.log('computer play');
          ticTacToe.computerTurn();
          // toggle turn again
        }
      }
    });

    // if computerPlayer start first
    if (!this.playerTurn) {
      // then play middle cell
      this.turnClick(CELLS[4]);
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
   * @return {boolean|undefined} Return false if game is ended
   */
  turnClick: function(cell) {
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
    if(!this.status(playerToken)) {
      // end game
      return false;
    }

    // toggle turn
    this.playerTurn = !this.playerTurn;
    
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
    let cellIndex = this.getBestMove();
    console.log(cellIndex);
    
    // arg must be cell element
    this.turnClick(CELLS[cellIndex]);
  },
  /**
   * My tic tac toe computer player algorithm : 
   * 1 : try to win in one move
   * 2 : try to prevent player from winning in one move
   * 3 : search for possibilities of winning
   * 4 : else play randomly
   * @return {number} Index of cell to play
   */
  getBestMove: function() {
    /** @ype {number} Cell index to be returned */
    let cellIndex;

    /**
     * is possible to win in one move
     * if possible then number is returned else false
     */
    cellIndex = this.oneMoveWin();
    
    // prevent boolean(0) === false
    if (cellIndex === 'number') {
      return cellIndex;
    }
    
    /**
     * if human player is one move off from winning
     * then prevent him from winning
     */
    cellIndex = this.preventOneMoveWin();
    
    // prevent boolean(0) === false
    if (typeof cellIndex === 'number') {
      return cellIndex;
    }

    /**
     * Try to win in 2 moves
     */
    cellIndex = this.twoMovesWin();

    // prevent boolean(0) === false
    if (cellIndex === 'number') {
      return cellIndex;
    }

    // Play randomly
    return this.getRandomEmptyCell();
  },
  oneMoveWin: function() {
    /**
     * Iterate on each combo array
     * Try to find if computer player is on move from winning
     * By couting matched cell combo
     */
    for (let i = 0; i < 8; i++) {
      /** @type {object} Hold data */
      let currentComboData = {};

      /**
       * Count all matching combo
       * if count === 2 then play this cell
       */ 
      let matchingWinComboCount = 0;
      
      for (let j = 0; j < 3; j++) {

        /** @type {number} Current win combo cell index */
        let cellIndex = this.winCombos[i][j];

        // If computer player played on win combo cell index then increment
        // Hold current combo data
        if (this.playersPositions.computerPlayer.includes(cellIndex)) {
          matchingWinComboCount++;
          currentComboData[j] = {
            index: cellIndex,
            matched: true
          }
        } else if (this.playersPositions.humanPlayer.includes(cellIndex)) {
          // if one of the cell is taken by human player then decrement
          matchingWinComboCount--;
        } else {
          // if cell is empty
          currentComboData[j] = {
            index: cellIndex,
            matched: false
          }
        }
      }
      
      // if computer player is one move from winning
      if (matchingWinComboCount === 2) {
        // get the unmatched empty cell index
        for (const property in currentComboData) {
          if (currentComboData[property].matched === false) {
            return currentComboData[property].index;
          }
        }
      }
    }

    // if not found possible winning move
    return false
  },
  /**
   * Prevent human player from one move off winning
   * Is similar to oneMoveWin (could refactor)
   * @return {number|boolean} Return Index number or false if none
   */
  preventOneMoveWin: function() {
    /**
     * Iterate on each combo array
     * Try to find if human player is on move from winning
     * By couting matched cell combo
     */
    for (let i = 0; i < 8; i++) {
      /** @type {object} Hold data */
      let currentComboData = {};

      /**
       * Count all matching combo
       * if count === 2 then play this cell
       */ 
      let matchingWinComboCount = 0;

      for (let j = 0; j < 3; j++) {
        // get current combo cell index
        let cellIndex = this.winCombos[i][j];
        
        // If human player played on win combo cell index then increment
        // Hold current combo data
        if (this.playersPositions.humanPlayer.includes(cellIndex)) {
          matchingWinComboCount++;
          currentComboData[j] = {
            index: cellIndex,
            matched: true
          } 
        } else if (this.playersPositions.computerPlayer.includes(cellIndex)) {
          // if one of the cell is taken by human player then decrement
          matchingWinComboCount--;
        } else {
          // if cell is empty
          currentComboData[j] = {
            index: cellIndex,
            matched: false
          }
        }
      }
      
      // if human player is one move from winning
      if (matchingWinComboCount === 2) {
        // get the unmatched empty cell index
        for (const property in currentComboData) {
          if (currentComboData[property].matched === false) {
            return currentComboData[property].index;
          }
        }
      }
    }

    // if not found possible winning move from human player
    return false;
  },
  /**
   * @return {array} All empty cells
   */
  getEmptyCells: function() {
    return this.board.filter((cellIndex) => {
      return typeof cellIndex === 'number';
    });
  },
  /**
   * Try to find all possible 2 moves ways of winning
   * And randomly pick one
   * @return {number|boolean} Number if cell found else false
   */
  twoMovesWin: function() {
    let emptyCells = this.getEmptyCells();

    /** @type {array} Array of win combo object */
    let holdWinCombos = [];

    /**
     * Iterate through all win combinations
     * And search for possibles win combinations
     * @return {number|undefined}
     */
    for (let i = 0; i < 8; i++) {
      /** @type {object} Hold data */
      let currentComboData = {};

      
       /** @type {number} Count all matching combo */
      let matchingWinComboCount = 0;

      /**
       * Loop on all win combinations
       */
      for (let j = 0; j < 3; j++) {
        let cell = this.winCombos[i][j];

        if (this.playersPositions.computerPlayer.includes(cell)) {
          matchingWinComboCount++;
          currentComboData[j] = {
            index: cell,
            matched: true
          }
        } else if (!emptyCells.includes(cell)) {
          // if cell is not empty then decrement
          matchingWinComboCount = -1;
          break;
        } else {
          currentComboData[j] = {
            index: cell,
            matched: false
          } 
        }
      }

      if (matchingWinComboCount === 1) {
        holdWinCombos.push(currentComboData);
      }
    }

    // getRandom cell
    let randomWinCombo = this.getRandomIntInclusive(0, holdWinCombos.length - 1);
    let randomCellIndex = this.getRandomIntInclusive(0, 3 - 1);
    return randomWinCombo[randomCellIndex];
  },
  /**
   * @return {number} Empty cell index
   */
  getRandomEmptyCell: function() {
    let emptyCells = this.getEmptyCells();
    let emptyCellsLength = emptyCells.length;
    let randomInt = this.getRandomIntInclusive(0, emptyCellsLength - 1);

    return emptyCells[randomInt];
  },
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  getRandomIntInclusive: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /**
   * Check winner
   * Check if game is ended
   * @param {string} playerToken
   * @return {boolean} whether game end or not
   */
  status: function(playerToken) {
    // When winning is possible
    if (this.turnCount >= 5) {
      if (this.checkWin(playerToken)) {
        this.gameOver(false);

        // stop game
        this.continue = false;
        return false;
      }
    }

    // When game is over and is draw
    if (this.turnCount === 9) {
      this.gameOver(true);

      // stop game
      this.continue = false;
      return false
    }

    // true if game should continue
    return true;
  },
  /**
   * Check if players has won the game
   * @param {string} player Player's token string (e.g. 'X')
   * @return {boolean} whether won or not
   */
  checkWin: function(player) {
    let playerTokens;

    // Determine who is playing and fetch all player's tokens positons
    if (player === this.humanPlayer) {
      playerTokens = this.playersPositions.humanPlayer;
    } else {
      playerTokens = this.playersPositions.computerPlayer;
    }
    
    /**
     * Check for each win combo if current player played one of them
     * Which would mean that current player won
     */
    for (let i = 0; i < 8; i++) {
      let isWon = this.winCombos[i].every((winIndex) => {
        return playerTokens.includes(winIndex);
      });
      
      if (isWon) {
        return true;
      }
    }
    
    return false;
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