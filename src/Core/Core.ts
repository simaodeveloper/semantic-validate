import DOMPurify from 'dompurify';
import { Form, Lang, Options, Rule, Schema } from '../types/types.js';

export default class Core {
    form: Form;
    lang: Lang;
    options: Options;
    rules: Map<string, Rule>;

    /**
     * 
     * @param form 
     * @param options 
     */
    constructor(form: string, options: Options = {}) {
        this.form = new WeakRef(document.querySelector(form));
        this.options = options;
        this.rules = new Map();
    }

    /**
     * 
     */
    validate() {}

    /**
     * 
     * @param lang 
     * @returns 
     */
    setLang(lang: string) {
        this.lang = lang;
        return this;
    }

    /**
     * 
     * @param rules 
     * @returns 
     */
    setRules(rules: Rule[]) {
        for(const rule of rules) {
            if (!this.rules.has(rule.name)) {
                this.throwError(new Error(`The ${rule.name} rule already exists!`));
            }

            this.rules.set(rule.name, rule);
        }

        return this;
    }

    /**
     * 
     * @param schema 
     * @returns 
     */
    setSchema(schema: Schema) {
        const strategy = {
            lang: (value) => this.lang = value,
            rules: (value) => this.setRules(value),
        };

        for (const [key, value] of Object.entries(schema)) {
            strategy[key](value);
        }

        return this;
    }

    /**
     * 
     */
    disableNativeValidation(flag = true) {
        this.form.deref().setAttribute('novalidate', String(flag));
    }

    setElementRules(element, rules) {
        for(const [attr, value] of Object.entries(rules)) {
            if (attr === 'name') continue;
            element.setAttribute(attr, value);
        }
    }

    bindElementsWithRules() {
        const onInput = (event) => {
            // console.log(event.target.validity);
        };

        for(const element of this.form.deref().elements) {
            const name = element.getAttribute('name');
            
            if (!name) continue;

            const rules = this.rules.get(name);

            if (!rules) continue;
            
            this.setElementRules(element, rules);

            element.removeEventListener('input', onInput);  
            element.addEventListener('input', onInput);
        }
    }

    sanitize(value: FormDataEntryValue) {
        return DOMPurify.sanitize(value as string);
    }

    getData() {

        const handleSelectMultiple = ([name, value]) => {
            const rules = this.rules.get(name);

            if (rules.type === 'select' && rules.multiple) {
                const select = this.form.deref().elements[name] as HTMLSelectElement;

                const selectedValues = [...select.selectedOptions]
                    .filter(option => option.selected)
                    .map(option => option.value)

                return [name, selectedValues];
            }

            return [name, value];
        }

        const formData = Array
            .from(new FormData(this.form.deref()).entries())
            .map(handleSelectMultiple)
            .map(([name, value]) => {
                return [
                    name,
                    this.options.sanitize ? this.sanitize(value) : value,
                ];                
            });

        return Object.fromEntries(formData);
    }

    getDataSerialized() {
        const formDataSerialized = new URLSearchParams();

        Array
            .from(Object.entries(this.getData()))
            .forEach(([name, value]) => formDataSerialized.set(name, String(value)));

        console.log(new URLSearchParams(formDataSerialized.toString()).get('select2'));
        

        
        return formDataSerialized.toString();
    }

    throwError(error: Error) {

    }
}