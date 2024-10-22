import Tokenizer from "./tokenizer.js";
import Parser from "./parser.js";
class Language {
    constructor(config, node_registry) {
        this.tokenizer = new Tokenizer(config.tokenizer);
        if (!node_registry) {
            this.parser = new Parser(config.parser, Parser.DEFAULT_REGISTRY);
        } else {
            this.parser = new Parser(config.parser, node_registry)
        }
    }
}
export default Language;