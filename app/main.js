import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import Language from "./utils/language.js";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)
if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];
const commands = ["tokenize", "parse"]; // Move the commands array outside the condition for better readability
if (!commands.includes(command)) {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

const filename = args[1];
let fileContent = fs.readFileSync(filename, "utf8");

class Tokenizer {
  static TOKEN_MAPPING = {
    "(": "LEFT_PAREN",
    ")": "RIGHT_PAREN",
    "{": "LEFT_BRACE",
    "}": "RIGHT_BRACE",
    "[": "LEFT_BRACKET",
    "]": "RIGHT_BRACKET",
    ",": "COMMA",
    ".": "DOT",
    "-": "MINUS",
    "+": "PLUS",
    ";": "SEMICOLON",
    "*": "STAR",
    "=": "EQUAL",
    "==": "EQUAL_EQUAL",
    "!": "BANG",
    "!=": "BANG_EQUAL",
    "<": "LESS",
    ">": "GREATER",
    "<=": "LESS_EQUAL",
    ">=": "GREATER_EQUAL",
    "//": "COMMENT",
    "/": "SLASH",
    " ": "WHITESPACE",
    "\t": "WHITESPACE",
    "\"": "STRING"
  };
  
  static IGNORED_MAPPINGS = ["COMMENT", "WHITESPACE"];
  static KEYWORD_MAPPINGS = {
    "and": "AND",
    "class": "CLASS",
    "else": "ELSE",
    "false": "FALSE",
    "for": "FOR",
    "fun": "FUN",
    "if": "IF",
    "nil": "NIL",
    "or": "OR",
    "print": "PRINT",
    "return": "RETURN",
    "super": "SUPER",
    "this": "THIS",
    "true": "TRUE",
    "var": "VAR",
    "while": "WHILE"
  };
  
  static MAPPING_KEYS = Object.keys(Tokenizer.TOKEN_MAPPING).sort((a, b) => b.length - a.length);
  static ERROR_MAPPING = {
    "tokenizer.unexpected_character": "Unexpected character: %d",
    "tokenizer.unterminated_string": "Unterminated string."
  };
  
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "lox.lang.json"), "utf8"));
    this.BST = this.genBST();
    this.REVERSE_MAPPING = Object.entries(Tokenizer.TOKEN_MAPPING).reduce((ret, entry) => {
      const [key, value] = entry;
      ret[value] = key;
      return ret;
    }, {});
    
    let { tokens, errors } = new Language(config).tokenizer.tokenize(fileContent);
    this.tokens = tokens; // Store tokens for later use
    this.errors = errors; // Store errors for later use
  }

  genBSTPart(bst, keyPart, fullKey) {
    if (bst[keyPart[0]] == null) {
      bst[keyPart[0]] = {
        "sub": {}
      };
    }
    if (keyPart.length > 1) {
      this.genBSTPart(bst[keyPart[0]].sub, keyPart.slice(1), fullKey);
    } else {
      bst[keyPart[0]].mapping = Tokenizer.TOKEN_MAPPING[fullKey];
    }
    return bst;
  }

  genBST() {
    let bst = {};
    for (let i = 0; i < Tokenizer.MAPPING_KEYS.length; i++) {
      let key = Tokenizer.MAPPING_KEYS[i];
      this.genBSTPart(bst, key, key);
    }
    return bst;
  }

  checkBST(char, bst) {
    if (bst) {
      if (bst[char[0]]) {
        let x = bst[char[0]];
        if ((x.sub != {}) && x.sub[char[1]]) {
          return this.checkBST(char.slice(1), x.sub);
        } else {
          return x.mapping;
        }
      } else {
        return null;
      }
    } else {
      return this.checkBST(char, this.BST);
    }
  }

  parseString(string, key) {
    let charIDX = 0;
    let nextChar = string[charIDX];
    let value = "";
    while (nextChar !== key && charIDX < string.length) {
      value += nextChar;
      charIDX += 1;
      nextChar = string[charIDX];
    }
    if (nextChar === key) {
      return {
        value,
        charIDX
      };
    } else {
      return null;
    }
  }

  parseNumber(number) {
    let charIDX = 0;
    let char = number[charIDX];
    let str = "";
    while (/[\d.]/.test(char)) {
      str += char;
      charIDX += 1;
      char = number[charIDX];
    }
    let num = parseFloat(str);
    return {
      str,
      num,
      charIDX
    };
  }

  parseLine(line, lineNum) {
    let tokens = [];
    let errors = [];
    for (let j = 0; j < line.length; j++) {
      let terminate = false;
      let found = false;
      if (!/[A-Za-z_]/.test(line[j])) {
        if (!/\d/.test(line[j])) {
          let mapping = this.checkBST(line.slice(j));
          if (mapping !== null) {
            let key = this.REVERSE_MAPPING[mapping];
            if (!Tokenizer.IGNORED_MAPPINGS.includes(mapping)) {
              if (mapping !== "STRING") {
                j += key.length - 1;
                tokens.push([mapping, key, null]);
              } else {
                let parsed = this.parseString(line.slice(j + 1), key);
                if (parsed === null) {
                  errors.push([lineNum, "tokenizer.unterminated_string", null]);
                  terminate = true;
                } else {
                  tokens.push(["STRING", `"${parsed.value}"`, parsed.value]);
                  j += parsed.charIDX + 1;
                }
              }
            }
          }
        } else {
          let parsed = this.parseNumber(line.slice(j));
          tokens.push(["NUMBER", parsed.str, parsed.num]);
          j += parsed.charIDX - 1;
        }
      } else {
        let val = "";
        while (/[A-Za-z0-9_]/.test(line[j]) && j !== line.length) {
          val += line[j];
          j += 1;
        }
        j -= 1;
        if (Tokenizer.KEYWORD_MAPPINGS[val]) {
          tokens.push([Tokenizer.KEYWORD_MAPPINGS[val], val, null]);
        } else {
          tokens.push(["IDENTIFIER", val, null]);
        }
        found = true;
      }
      if (terminate) break;
      if (!found) {
        errors.push([lineNum, "tokenizer.unexpected_character", line[j]]);
      }
    }
    return {
      tokens,
      errors
    };
  }

  main(fileContent) {
    if (fileContent.length !== 0) {
      let fileLines = fileContent.split("\n");
      let tokens = [];
      let errors = [];
      for (let i = 0; i < fileLines.length; i++) {
        let parsed = this.parseLine(fileLines[i], i + 1);
        tokens = tokens.concat(parsed.tokens);
        errors = errors.concat(parsed.errors);
      }
      tokens.push(["EOF", null, "null"]);
      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        console.error(`[line ${error[0]}] Error: ${Tokenizer.ERROR_MAPPING[error[1]].replace("%d", error[2])}`);
      }
      let numberFormat = Intl.NumberFormat("en-us", {
        minimumFractionDigits: 1,
        useGrouping: false
      });
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token[2] == null) token[2] = "null";
        if (typeof token[2] === "number") token[2] = numberFormat.format(token[2]);
        console.log(tokens[i].join(" "));
      }
      if (errors.length > 0) {
        process.exit(65);
      }
    } else {
      console.log("EOF  null");
    }
    
    // Move this inside the command check to ensure it only runs during 'parse' command
    let ast = language.parser.parse(this.tokens);
    if (command === "parse") {
      language.parser.print(ast);
      if (errors.length > 0) {
        process.exit(65);
      }
    }
  }
}

// Create the tokenizer and execute the main function
let tokenizer = new Tokenizer();
tokenizer.main(fileContent);

if (command === "tokenize") {
  tokenizer.print(tokenizer.tokens, tokenizer.errors);
  if (tokenizer.errors.length > 0) {
    process.exit(65);
  }
  process.exit();
}
