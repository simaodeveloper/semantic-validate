type Options = {
    sanitize?: boolean;
    serialized?: boolean;
};
type Form = WeakRef<HTMLFormElement>;
type Lang = string;
type Types = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'textarea' | 'select';
type Rule = {
    name: string;
    type?: Types;
    minlength?: number;
    maxlength?: number;
    required?: boolean;
    multiple?: boolean;
};
type Message = {};
type Schema = {
    lang?: string;
    rules?: Rule[];
    messages?: Message[];
};

declare class Core {
    form: Form;
    lang: Lang;
    options: Options;
    rules: Map<string, Rule>;
    /**
     *
     * @param form
     * @param options
     */
    constructor(form: string, options?: Options);
    /**
     *
     */
    validate(): void;
    /**
     *
     * @param lang
     * @returns
     */
    setLang(lang: string): this;
    /**
     *
     * @param rules
     * @returns
     */
    setRules(rules: Rule[]): this;
    /**
     *
     * @param schema
     * @returns
     */
    setSchema(schema: Schema): this;
    /**
     *
     */
    disableNativeValidation(flag?: boolean): void;
    setElementRules(element: any, rules: any): void;
    bindElementsWithRules(): void;
    sanitize(value: FormDataEntryValue): string;
    getData(): any;
    getDataSerialized(): string;
    throwError(error: Error): void;
}

declare class SemanticValidate extends Core {
    /**
     *
     * @param form
     * @param options
     */
    constructor(form: string, options?: Options);
    /**
     * Add a lang to setup right messages
     * @param lang
     * @returns SemanticValidate instance
     */
    addLang(lang: Lang): SemanticValidate;
    /**
     * Add rules for de fields
     * @param rules
     * @returns SemanticValidate instance
     */
    addRules(rules: Rule[]): this;
    /**
     * Add a schema
     * @param schema
     * @returns SemanticValidate instance
     */
    addSchema(schema: Schema): SemanticValidate;
    /**
     * Render form based on rules
     * @returns SemanticValidate instance
     */
    render(): SemanticValidate;
    /**
     * Trigger the fn callback when form is sumitted
     * @param fn
     */
    whenSubmit(fn: any): void;
}

export { SemanticValidate as default };
