const HANGMAN = document.getElementById('hangman');
const GUESS_WORD = document.getElementById('guess-word');
const LETTERS_LIST = document.getElementById('letters-list');
const USED_LETTERS_LIST = document.getElementById('used-letters-list');
const HANGMAN_BODY = document.getElementById('hangman__body');

let hangmanGame = {
  randName: [],
  guessWord: [],
  usedLetters: [],
  life: 6,
  fetchRandName: function() {
    return fetch(
      "https://jsonplaceholder.typicode.com/users/" +
        Math.floor(Math.random() * 10 + 1)
    )
      .then(response => response.json())
      .catch(error => console.error("Error:", error))
      .then(
        json =>
          (this.randName = this.filterAlphanumeric(json.name)
            .toUpperCase()
            .split(''))
      );
  },
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
  filterAlphanumeric: function(str) {
    return str.replace(/[^0-9a-z ]/gi, "");
  },
  initiateGuessWord: function(word) {
    for (const letter of word) {
      if (letter !== " ") {
        this.guessWord.push("_");
      } else {
        this.guessWord.push(" ");
      }
    }
  },
  evaluateLetter: function(letter) {
    if (this.randName.includes(letter)) {
      this.drawGuessWord(letter);
    } else {
      this.drawHangman();
      this.life--;
    }

    this.status();
  },
  drawHangman: function() {
    let index = Math.abs(this.life - 6);
    HANGMAN_BODY.children[index].classList.remove('hidden');
  },
  /**
   * @param guessLetter if null then fully draw guess letter
   */
  drawGuessWord: function(guessLetter = null) {
    if (guessLetter) {
      this.randName.forEach((letter, index) => {
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
  updateLetterBtn: function(letter = null, reset = null) {
    if (letter) {
      letter.classList.remove("clickable");
      letter.classList.add("used-letter");
      USED_LETTERS_LIST.appendChild(letter);
    }
  },
  updateLife: function(reset = false) {
    this.life = reset ? 6 : this.life - 1;
  },
  clearGuessWord: function() {
    GUESS_WORD.innerHTML = "";
  },
  /**
   * Check for game status at each evaluation
   */
  status: function(found = false) {
    if (this.life <= 0) {
      this.reset(false);
    }

    if (this.guessWord.indexOf("_") === -1) {
      this.reset(true);
    }
  },
  reset: function(won) {
    let msg = won ? "Well play !" : "Bad choices !";
    let replay = window.confirm(msg + " Do you want to play again ?");

    if (replay) {
      window.location.reload();
    } else {
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

hangmanGame.fetchRandName().then(() => {
  hangmanGame.initiateGuessWord(hangmanGame.randName);
  hangmanGame.drawGuessWord();
  hangmanGame.createLettersBtn(LETTERS_LIST);
});

LETTERS_LIST.addEventListener('click', e => {
  if (e.target.classList.contains("letter-btn", "clickable")) {
    hangmanGame.updateLetterBtn(e.target);
    hangmanGame.evaluateLetter(e.target.innerText);
    // draw hangman if false or letter
  }
});
