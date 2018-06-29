// node doesn't support ECMAScript Modules (experimental)
const RANDOM_WORDS = [
  'hello world',
  'pizza',
  'kamehameha',
  'welcome to the jungle',
  'john doe',
  'yes we can'
];

const GUESS_WORD = document.getElementById('guess-word');
const LETTERS_LIST = document.getElementById('letters-list');
const USED_LETTERS_LIST = document.getElementById('used-letters-list');
const HANGMAN_BODY = document.getElementById('hangman__body');

let hangmanGame = {
  randWord: null,
  guessWord: [],
  usedLetters: [],
  life: 6,
  /**
   * Initiate the game by inserting buttons...
   * @return {undefined}
   */
  start: function () {
    this.fetchRandWord();
    this.initiateGuessWord(this.randWord);
    this.drawGuessWord();
    this.createLettersBtn(LETTERS_LIST);
  },
  /**
   * Get random word then filter and turn it to array of letters
   * @param {array} names Array of strings
   * @return {string}
   */
  fetchRandWord: function(names) {
    this.randWord = RANDOM_WORDS[getRandomInt(RANDOM_WORDS.length - 1)];
    this.randWord = filterAlphanumeric(this.randWord.toUpperCase());
    this.randWord = this.randWord.split('');
    
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * Only alphanumeric words are valid
     * @param {string} str A random word
     * @return {string} filtered valid string
     */
    function filterAlphanumeric(str) {
      return str.replace(/[^0-9a-z ]/gi, '');
    }
  },
  /**
   * Create all clickable letters buttons
   * @param {HTMLElement} targetElement in which letters are inserted 
   * @param {string} letters Each chars is a button 
   * @return {undefined}
   */
  createLettersBtn: function(
    targetElement,
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ) {
    for (const letter of letters) {
      targetElement.insertAdjacentHTML(
        "beforeend",
        `<span class="letter-btn clickable">${letter}</span>`
      );
    }
  },
  /**
   * Initiate the game by drawing hidden letters
   * @param {string} word
   * @return {undefined}
   */
  initiateGuessWord: function(word) {
    for (const letter of word) {
      if (letter !== " ") {
        this.guessWord.push("_");
      } else {
        this.guessWord.push(" ");
      }
    }
  },
  /**
   * Evaluate whether player guessed well or not
   * @return {undefined}
   */
  evaluateLetter: function(letter) {
    if (this.randWord.includes(letter)) {
      this.drawGuessWord(letter);
    } else {
      this.drawHangman();
      this.life--;
    }

    this.status();
  },
  /**
   * Draw hangman body part according to player life
   * @return {undefined}
   */
  drawHangman: function() {
    let index = Math.abs(this.life - 6);
    HANGMAN_BODY.children[index].classList.remove('hidden');
  },
  /**
   * Redraw word to guess each time user click on the buttons
   * @param {?string} guessLetter if null then fully draw guess letter
   * @return {undefined} 
   */
  drawGuessWord: function(guessLetter = null) {
    if (guessLetter) {
      this.randWord.forEach((letter, index) => {
        if (letter === guessLetter) {
          this.guessWord[index] = letter;
        }
      });
    }

    this.clearGuessWord();
    this.guessWord.forEach(function(char) {
      GUESS_WORD.insertAdjacentHTML(
        "beforeend",
        `<span class="guess-letter">${char}</span>`
      );
    });
  },
  /**
   * Display the answer to guess if player loses
   * @return {undefined}
   */
  showRandWord: function() {
    this.randWord.forEach(function (letter) {
      GUESS_WORD.insertAdjacentHTML(
        "beforeend",
        `<span class="guess-letter">${letter}</span>`
      );
    });
  },
  /**
   * When player click on a button, remove its click ability and move it to already cilcked group
   * @param {?string} letter 
   * @return {undefined}
   */
  updateLetterBtn: function(letter = null) {
    if (letter) {
      letter.classList.remove("clickable");
      letter.classList.add("used-letter");
      USED_LETTERS_LIST.appendChild(letter);
    }
  },
  /**
   * Decrease player life point by one
   * @param {boolean} reset
   * @return {undefined}
   */
  updateLife: function(reset = false) {
    this.life = reset ? 6 : this.life - 1;
  },
  /**
   * Clear guess word HTMLElement
   * @return {undefined}
   */
  clearGuessWord: function() {
    GUESS_WORD.innerHTML = "";
  },
  /**
   * Take appropriate action depending on whether user found letter or not 
   * @param {boolean} found
   * @return {undefined}
   */
  status: function(found = false) {
    if (this.life <= 0) {
      this.reset(false);
    }

    if (this.guessWord.indexOf("_") === -1) {
      this.reset(true);
    }
  },
  /**
   * After game finished, dislay game message and replay button
   * @param {boolean} won
   * @return {undefined}
   */
  reset: function(won) {
    let msg = won ? "Well play !" : "Bad choices !";
    let replay = window.confirm(msg + " Do you want to play again ?");

    if (replay) {
      window.location.reload();
    } else {
      this.clearGuessWord();
      this.showRandWord();

      LETTERS_LIST.remove();
      GUESS_WORD.insertAdjacentHTML(
        'afterend',
        '<button id="replay-btn">Replay</button>'
      );
      document.getElementById('replay-btn').onclick = () => {
        window.location.reload();
      };
    }
  }
};

hangmanGame.start();

LETTERS_LIST.addEventListener('click', e => {
  if (e.target.classList.contains('letter-btn', 'clickable')) {
    // remove clickable btn
    hangmanGame.updateLetterBtn(e.target);
    // then evaluate clicked letter
    hangmanGame.evaluateLetter(e.target.innerText);
  }
});
