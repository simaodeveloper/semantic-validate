import Emitter from './Emitter';
import { Dictionary, Field, Messages, Options, SchemaAttributes, SchemaAttributeValue, SchemaRules, SubmitResult } from '../types/types';
import { getType, pipe } from '../utils/utils';
import CustomError from './CustomError';
import Schema from './Schema';
import defaultMessages from '../messages';
import { AdapterConstraint, FieldStatus } from '../enums';

export default class Core extends Emitter {
    form: HTMLFormElement;
    fields: Map<string, Field[]>;
    options: Options;
    schemas: Map<string, Schema>;
    isRulesBinded: {
        [name: string]: boolean | undefined;
    };
    data: {
        hash: Map<string, string | string[]>;
        serialized: URLSearchParams;
    };
    messages: Messages;

    /**
     * 
     * @param selector 
     * @param options 
     */
    constructor(selector: string, options: Options = {}) {
        super();
        
        this.form = document.querySelector(selector) as HTMLFormElement;
        this.fields = this.extractElementsFromForm();

        if (!this.form) {
            CustomError.catch(
                new CustomError(`The form element with the [${selector}] doesn't exists!`)
            );
        }
        
        this.options = this.setOptions(options);
        this.schemas = new Map();
        this.isRulesBinded = {};
        this.data = {
            hash: new Map(),
            serialized: new URLSearchParams(),
        };
        this.messages = {
            defaults: {...defaultMessages},
            schemas: {},
        };

        if (this.options.schemas) {
            this.setSchemas(this.options.schemas);
        }

        if (this.options.messages) {
            this.setMessages(this.options.messages);
        }
    }

    /**
     * 
     * @returns 
     */
    private extractElementsFromForm(): Map<string, Field[]> {
        const fields = Array
            .from(this.form.elements as unknown as Field[])
            .filter(element => (element.localName !== 'button'))
            .reduce((acc: Dictionary<Field[]>, next: Field) => ({
                ...acc,
                [next.name]: [...(acc[next.name] || []), next]
            }), {});   
            
        return new Map(Object.entries(fields));
    }

    /**
     * 
     * @param options 
     * @returns 
     */
    protected setOptions(options: Options): Options {
        const defaultOptions = {
            sanitize: (value: string) => value,
            serialized: false,
            novalidate: true,
        };

        return Object.assign({}, defaultOptions, options);
    }

    /**
     * 
     * @param rules 
     * @returns 
     */
    protected setSchemas(schemas: SchemaRules): Core {
        for(const [name, schema] of Object.entries(schemas)) {
            if (this.schemas.has(name)) {
                throw new CustomError(`The ${name} rule already exists!`);
            }

            this.schemas.set(name, schema);
            this.setAttributes(name, schema.attributes);
        }

        return this.setup();
    }

    /**
     * 
     * @param messages 
     */
    protected setMessages(messages: Messages) {
        this.messages.defaults = {
            ...messages.defaults,
            ...this.messages.defaults,
        };

        for (const name in messages.schemas) {                                                    
        } 
    }

    /**
     * 
     * @param rule 
     * @param name 
     * @returns 
     */
    protected handleMessage(rule: string, name: string): Core {
        const messageEl = this.form.querySelectorAll(`[data-sv-name="${name}"]`);

        if (messageEl.length > 0)
            messageEl[messageEl.length - 1].remove();

        if (rule === 'valid') 
            return this;        
        
        let message: string = '';
        
        if (JSON.stringify(this.messages.defaults) !== '{}') {
            message = this.messages.defaults?.[rule];
        }

        const wrapper = document.createElement('span');
        wrapper.setAttribute('arial-labelly', name);
        wrapper.setAttribute('data-sv-name', name);
        wrapper.setAttribute('data-sv-rule', rule);
        wrapper.classList.add('error-message');
        wrapper.textContent = message;

        const fields = this.fields.get(name) as Field[];
        const target = fields.at(-1) as Field;

        if (fields.length > 1) {
            (<ParentNode>target.parentNode).append(wrapper);
        } else {
            (<ChildNode>target).after(wrapper);
        }
        
        return this;
    }

    /**
     * 
     * @param rule 
     * @param name 
     * @returns 
     */
    private handleStyle(rule: string, field: Field) {  
        field.setAttribute('data-sv-valid', (rule === 'valid').toString());
        return this;
    }

    /**
     * 
     * @returns 
     */
    private initStyleValition() {
        this.form.setAttribute('data-sv-init', "true");
        return this;
    }

    /**
     * 
     */
    private disableNativeValidation(): Core {
        this.options.novalidate &&
            this.form.setAttribute('novalidate', 'true');

        return this;
    }

    /**
     * 
     * @param field 
     * @param schema 
     * @returns 
     */
    private setSchemaIntoField(field: Field): Core {
        const schema = this.schemas.get(field.name) as Schema;

        for (const [rule, value] of schema.rule) {
            if (getType(value) === 'function') continue;
            field.setAttribute(rule, String(value));
        }

        return this;
    }

    /**
     * 
     * @param field 
     * @returns 
     */
    private bindSchemaWithFieldOnce(field: Field): Core {

        if (!this.schemas.get(field.name)) return this;

        if (!this.isRulesBinded[field.name]) {
            this.isRulesBinded[field.name] = true;
            this.setSchemaIntoField(field);
        }

        return this;
    }

    /**
     * 
     * @param field 
     * @returns 
     */
    private validate(field: Field): [string, string] {
        this.bindSchemaWithFieldOnce(field);

        // TODO: do function validation

        const constraint = this.transformConstraint(
            field.getAttribute('name') as string,
            field.validity,
        ) as [string, string];

        return constraint;
    }

    /**
     * 
     * @param field 
     * @returns 
     */
    private bindValidation(field: Field): Core {
        const constraint = this.validate(field);
        this.handleStyle(constraint[0], field);
        this.handleMessage(constraint[0], field.name);

        return this;
    }

    /**
     * 
     * @returns 
     */
    private setEvents(): Core {
        this.on('form:submit', () => {});

        const onInput = (event: Event) => {
            this.bindValidation(event.target as Field);
        };

        this.form.removeEventListener('input', onInput);
        this.form.addEventListener('input', onInput);

        const onSumit = (event: SubmitEvent) => {
            event.preventDefault();

            for (const [, fields] of this.fields) {
                this.bindValidation(fields[0]);
            }

            const data = this.getData();

            const result = {
                valid: this.form.checkValidity(),
                values: Object.fromEntries(data.hash),
                serialized: data.serialized.toString(),
            };

            this.emit<[SubmitEvent, SubmitResult]>(
                'form:submit', event, result
            );
        };

        this.form.removeEventListener('submit', onSumit);
        this.form.addEventListener('submit', onSumit);

        return this;
    }

    /**
     * 
     * @param name 
     * @param validityState 
     * @returns 
     */
    private transformConstraint(name: string, validityState: ValidityState) {
        for (const constraint of Object.values(FieldStatus)) {          
            if (validityState[constraint as keyof typeof validityState]) {
                return [AdapterConstraint[constraint as keyof typeof validityState], name]; 
            }
        }        
    }

    /**
     * 
     * @param value 
     * @returns 
     */
    private sanitize(value: FormDataEntryValue) {
        return String(this.options.sanitize?.(value as string));
    }

    /**
     * 
     * @returns 
     */
    protected getData() {

        const transformSelectMultipleValue = ([name, value]: [string, SchemaAttributeValue]) => {
            const schema = this.schemas.get(name) as Schema;
            const elementName = name as keyof typeof this.form.elements;
            
            if (!schema) {
                return [name, value];
            }

            // TODO: check if multiple exists after set all attributes
            if (schema.rule.get('type') === 'select' && schema.attributes.get('multiple')) {
                const select = this.form.elements[elementName] as HTMLSelectElement;
                const selectedValues = [...Array.from(select.selectedOptions)]
                    .filter(option => option.selected)
                    .map(option => option.value);

                return [name, selectedValues];
            }

            return [name, value];
        }
        
        Array
            .from(new FormData(this.form).entries())
            .map(pipe(
                transformSelectMultipleValue
            ))
            .forEach(([name, value]) => {

                const isValueArray = Array.isArray(value);

                const hashValue = isValueArray
                    ? value.map(v => this.sanitize(v))
                    : this.sanitize(value);

                this.data.hash.set(name, hashValue);
                this.data.serialized.set(name, hashValue.toString());             
            });

        return this.data;
    }

    /**
     * 
     * @param name 
     * @param attributes 
     * @returns 
     */
    private setAttributes(name: string, attributes: SchemaAttributes) {
        const field = this.fields.get(name);

        if (field === undefined) return this;

        field.forEach((field) => {
            
            if (attributes.size === 0) return false;
            
            for (const [attr, value] of attributes) {
                field.setAttribute(attr, value as string);

                if (attr !== 'multiple') continue;

                const option = field.querySelector('option');
                    
                if (option) {
                    option.selected = false;
                } 
            }
        });
        
        return this;
    }

    private addWrapperToCollection(): Core {
        
        for (const [name, fields] of this.fields) {
            if (fields.length === 1) continue;
            
            const wrapper = document.createElement('div');

            wrapper.setAttribute('data-sv-collection', name);
            
            const parent = fields[0].parentNode as ParentNode;

            Array
                .from(parent.children as HTMLCollection)
                .forEach(field => {
                    wrapper.append(field);
                });

            parent.append(wrapper);
        }
        
        return this;
    }

    /**
     * 
     * @returns 
     */
    private setup(): Core {
        try {
            this
                .addWrapperToCollection()
                .disableNativeValidation()
                .initStyleValition()
                .setEvents();
        } catch(error) {
            CustomError.catch(error);
        }

        return this;
    }

    public destroy(): Core {
        // back to the original html
        return this;
    }
}