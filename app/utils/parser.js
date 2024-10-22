import nodes from "./ast/nodes.js";
class Parser {
    getString(ast) {
        return ast.toString();
    }
    print(ast) {
        if (ast) {
            console.log(this.getString(ast));
        }
    }
    static DEFAULT_REGISTRY = {
        "literal": nodes.LiteralNode
    }
    constructor(config, registry) {
        this.nodes = {};
        let registry_keys = Object.keys(registry);
        for (let i = 0; i < registry_keys.length; i++) {
            let key = registry_keys[i];
            if (config.nodes.includes(key)) {
                this.nodes[key] = registry[key];
            }
        }
        this.node_config = config.node_config;
    }
    parse(tokens) {
        let node_list = Object.keys(this.nodes);
        for (let i = 0; i < node_list.length; i++) {
            let key = node_list[i];
            let config = this.node_config[key];
            if (this.nodes[key].check(config, tokens)) {
                let node = new this.nodes[key](config, tokens);
                return node;
            }
        }
    }
}
export default Parser;