import { Pattern, SchemaAttributeValue, SchemaRuleValue, TypeOptions } from "../types/types";
import Fields from "./Fields";

export default class Schema {
    rule: Map<string, SchemaRuleValue>;
    attributes: Map<string, SchemaAttributeValue>;

    constructor(value?: string, options?: TypeOptions) {
        this.rule = new Map();
        this.attributes = new Map();
        this.type(value, options);
    }

    setRule<T extends SchemaRuleValue>(rule: string, value: T) {
        this.rule.set(rule, value);
        return this;
    }

    type(value: string = 'text', options: TypeOptions = {}) {
        if (new Map(Object.entries(options)).size !== 0) {            
            for (const [attribute, value] of Object.entries(options)) {
                this.attributes.set(attribute, value);
            }        
        }

        return this.setRule('type', value);
    }

    minlength(value: number) {
        return this.setRule('minlength', value);
    }

    maxlength(value: number) {
        return this.setRule('maxlength', value);
    }

    min(value: number) {
        return this.setRule('min', value);
    }

    max(value: number) {
        return this.setRule('max', value);
    }

    required() {
        return this.setRule('required', true);
    }

    pattern(value: Pattern) {
        return this.setRule('pattern', value);
    }

    dependsOn() {}

    mask() {}
}
