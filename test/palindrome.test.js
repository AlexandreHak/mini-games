/**
 * Node doesn't support ECMAScript modules and module.exports can't
 * be used in web context (public/js/palindrome.js) so I decided to place isPalindrome here
 * 
 * @param {string} value
 * @return {boolean} whether is palindrome or not  
 */
function testPalindrome(value) {
  value = filterValue(value);

  return isPalindrome(value) ? true : false;

  /**
   * @param {*} value
   * @return {boolean} whether is valid palindrome
   */
  function isPalindrome(value) {
    let reversedValue = "";

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

  function filterValue(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  }
}

/**
 * Run npm test
 */
describe("Are valid palindrome", () => {
  test("without spaces or punctuations", () => {
    expect(testPalindrome("madam")).toBeTruthy();
  });

  test("with spaces and punctuations", () => {
    expect(testPalindrome("hello?. olleh")).toBeTruthy();
  });

  test("ignore letter case", () => {
    expect(testPalindrome("Ama")).toBeTruthy();
  });

  test("ignore spaces", () => {
    expect(testPalindrome("nurses run")).toBeTruthy();
  });

  test("one letter should be thruthy", () => {
    expect(testPalindrome("A")).toBeTruthy();
  });
});

describe("Are not palindrome", () => {
  test("hello world should be falsy", () => {
    expect(testPalindrome("hello world")).toBeFalsy();
  });

  test("punctuations should be falsy", () => {
    expect(testPalindrome("//")).toBeFalsy();
  });
});
