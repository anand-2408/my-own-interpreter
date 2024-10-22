class Token {
    constructor(type, char, value) {
      this.type = type;
      this.char = char;
      this.value = value;
    }
  }
  class Tokenizer {
    static ERROR_MAPPING = {
      "tokenizer.unexpected_character": "Unexpected character: %d",
      "tokenizer.unterminated_string": "Unterminated string."
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
        bst[keyPart[0]].mapping = this.TOKENS[fullKey];
      }
      return bst;
    }
    genBST() {
      let bst = {};
      for (let i = 0; i < this.MAPPING_KEYS.length; i++) {
        let key = this.MAPPING_KEYS[i];
        this.genBSTPart(bst, key, key);
      }
      return bst
    }
    print(tokens, errors) {
      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        console.error(`[line ${error[0]}] Error: ${Tokenizer.ERROR_MAPPING[error[1]].replace("%d", error[2])}`);
      }
      let numberFormat = Intl.NumberFormat("en-us",{
        minimumFractionDigits: 1,
        useGrouping: false
      });
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let printing = [token.type,token.char,token.value];
        if (token.value === null) printing[2] = "null";
        if (token.type === "NUMBER") printing[2] = numberFormat.format(token.value)
        console.log(printing.join(" "));
      }
    }
    constructor(config) {
      this.TOKENS = config.tokens;
      this.IGNORED = config.ignored;
      this.KEYWORDS = config.keywords;
      this.MAPPING_KEYS = Object.keys(this.TOKENS).sort((a,b)=>b.length-a.length);
      this.BST = this.genBST();
      this.REVERSE_MAPPING = Object.entries(this.TOKENS).reduce((ret, entry) => {
        const [ key, value ] = entry;
        ret[ value ] = key;
        return ret;
      }, {});
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
    parseString(string,key) {
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
        }
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
        char = number[charIDX]
      }
      let num = parseFloat(str);
      return {
        str,
        num,
        charIDX
      }
    }
    parseLine(line,lineNum) {
      let tokens = [];
      let errors = [];
      for (let j = 0; j< line.length; j++) {
        let terminate = false;
        let found = false;
        if (!/[A-Za-z_]/.test(line[j])) {
          if (!/\d/.test(line[j])) {
            let mapping = this.checkBST(line.slice(j));
            if (mapping !== null) {
              let key = this.REVERSE_MAPPING[mapping];
              if (!(mapping in this.IGNORED)) {
                if (mapping !== "STRING") {
                  j += key.length - 1;
                  if (!this.IGNORED.includes(mapping)) {
                    tokens.push(new Token(mapping, key, null));
                  } else if (mapping == "COMMENT") {
                    terminate = true;
                  }
                  found = true;
                } else {
                  let parsed = this.parseString(line.slice(j+1),key);
                  if (parsed === null) {
                    errors.push([lineNum, "tokenizer.unterminated_string",null]);
                    terminate = true;
                  } else {
                    tokens.push(new Token("STRING", `"${parsed.value}"`, parsed.value))
                    j += parsed.charIDX+1;
                    found = true;
                  }
                }
              } else {
                found = true;
              }
            }
          } else {
            let parsed = this.parseNumber(line.slice(j));
            tokens.push(new Token("NUMBER",parsed.str,parsed.num));
            found = true;
            j += parsed.charIDX - 1;
          }
        } else {
          let val = "";
          while (/[A-Za-z0-9_]/.test(line[j]) && j != line.length) {
            val += line[j];
            j += 1;
          }
          j -= 1;
          if (this.KEYWORDS[val]) {
            tokens.push(new Token(this.KEYWORDS[val],val,null));
          } else {
            tokens.push(new Token("IDENTIFIER",val,null));
          }
          found = true;
        }
        if (terminate) break;
        if (!found) {
          errors.push([lineNum, "tokenizer.unexpected_character",line[j]])
        }
      }
      return {
        tokens,
        errors
      }
    }
    tokenize(fileContent) {
      let fileLines = fileContent.split("\n");
      let tokens = [];
      let errors = [];
      for (let i = 0; i < fileLines.length; i++) {
        let parsed = this.parseLine(fileLines[i],i+1);
        tokens = tokens.concat(parsed.tokens)
        errors = errors.concat(parsed.errors)
      }
      tokens.push(new Token("EOF",null,null));
      return {tokens, errors};
    }
  }
  export default Tokenizer;