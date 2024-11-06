/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  if (param !== "asc" && param !== "desc") {
    throw new Error("Должно быть 'asc' или 'desc'");
  }
  return arr.slice().sort((a, b) => {
    if (param === "asc") {
      return a.localeCompare(b, undefined, {
        sensitivity: "variant",
        caseFirst: "upper",
      });
    } else {
      return b.localeCompare(a, undefined, {
        sensitivity: "variant",
        caseFirst: "upper",
      });
    }
  });
}
