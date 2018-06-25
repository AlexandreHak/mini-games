const FORM = document.getElementById("form");
const FORM_INPUT = document.getElementById("form__input");
const FEEDBACK = document.getElementById("feedback");

FORM.addEventListener("submit", function(e) {
  e.preventDefault();

  if (isPalindrome(FORM_INPUT.value)) {
    FEEDBACK.innerHTML = '<em>' + FORM_INPUT.value + '</em> is a palindrome !';
  } else {
    FEEDBACK.innerText = 'NOPE !';
  }
});

function isPalindrome(value) {
  let reversedValue = '';

  // is not empty
  if (value) {
    let startIndex = value.length;

    for (let i = startIndex - 1; i >= 0; i--) {
      reversedValue += value[i];
    }

    return value === reversedValue;
  }
}
