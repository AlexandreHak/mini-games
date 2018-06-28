const FORM = document.getElementById("form");
const FORM_INPUT = document.getElementById("form__input");
const FEEDBACK = document.getElementById("feedback");

FORM.addEventListener("submit", function(e) {
  e.preventDefault();
  
  let value = filterValue(FORM_INPUT.value, '');

  if (isPalindrome(value)) {
    FEEDBACK.innerHTML = '<em>' + FORM_INPUT.value + '</em> is a palindrome !';
  } else {
    FEEDBACK.innerHTML = '<em>'+ FORM_INPUT.value + '</em>' + ' is <b>NOT</b> a palindrome !';
  }
});

/**
 * @param {*} value 
 * @return {boolean} whether is valid palindrome
 */
function isPalindrome(value) {
  let reversedValue = '';

  // is not empty
  if (value) {
    let startIndex = value.length;

    for (let i = startIndex - 1; i >= 0; i--) {
      if (value) {
        reversedValue += value[i];
      }
    }

    return value === reversedValue;
  }
}

/**
 * Filter every characters except for lowercase and numbers
 * @param {string} value
 * @return {string} filtered string
 */
function filterValue(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}