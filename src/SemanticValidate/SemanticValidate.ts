import { Core } from "../Core";
import { Lang, Options, Rule, Schema } from "../types/types";

export default class SemanticValidate extends Core {
    /**
     * 
     * @param form 
     * @param options 
     */
    constructor(form: string, options?: Options) {
        super(form, options);
    }

    /**
     * Add a lang to setup right messages
     * @param lang 
     * @returns SemanticValidate instance
     */
    addLang(lang: Lang): SemanticValidate {
        return super.setLang(lang);
    }

    /**
     * Add rules for de fields
     * @param rules 
     * @returns SemanticValidate instance
     */
    addRules(rules: Rule[]) {
        return super.setRules(rules);
    }

    /**
     * Add a schema
     * @param schema 
     * @returns SemanticValidate instance
     */
    addSchema(schema: Schema): SemanticValidate {
        return this.setSchema(schema);
    }

    /**
     * Render form based on rules
     * @returns SemanticValidate instance
     */
    render(): SemanticValidate {
        super.disableNativeValidation();
        super.bindElementsWithRules();
        return this;
    }

    /**
     * Trigger the fn callback when form is sumitted
     * @param fn 
     */
    whenSubmit(fn) {
        const handler = (event: Event) => {
            event.preventDefault();

            fn(event, {
                valid: this.form.deref().checkValidity(),
                values: super.getData(),
                ...(this.options.serialized && { 
                    serialized: super.getDataSerialized() 
                }),
            });
        };

        this.form.deref().removeEventListener('submit', handler);
        this.form.deref().addEventListener('submit', handler);
    }
}
