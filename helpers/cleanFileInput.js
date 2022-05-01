export default function cleanFileInput(input) {
  // Replace all comments
  input = input.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");
  // Split into Arrays of lines
  input = input.split("\n");

  for (let [i, line] of input.entries()) {
    // Replace whitespaces in the beginning
    line = line.replace(/^\s+/gm, "");
    // Clean \r and \t characters
    input[i] = line.replace("\r", "").replace("\t", "");
  }
  // remove empty elements
  input = input.filter((e) => e);
  return input;
}
