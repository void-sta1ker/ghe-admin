/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface String {
  /** Converts the string to capital case with a default separator of " ".
   * Augmented String prototype with toCapitalCase method
   */
  toCapitalCase: (separator?: string) => string;
}

String.prototype.toCapitalCase = function toCapitalCase(separator = " ") {
  return this.split(separator)
    .map((word) => {
      const firstLetter = word[0].toUpperCase();
      const rest = word.slice(1);
      return firstLetter + rest;
    })
    .join(" ");
};
