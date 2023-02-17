import SemanticValidateError from './CustomError';
import Emitter from './Emitter';
import { Options, SchemaAttributes, SchemaAttributeValue, SchemaRules, SchemaRuleValue, SubmitResult } from '../types/types';
import { getType, pipe } from '../utils/utils';
import CustomError from './CustomError';
import Schema from './Schema';

export default class Core extends Emitter {
    form: HTMLFormElement;
    options: Options;
    schemas: Map<string, Schema>;
    isRulesBinded: {
        [name: string]: boolean | undefined;
    };
    data: {
        hash: Map<string, string | string[]>;
        serialized: URLSearchParams;
    };

    /**
     * 
     * @param selector 
     * @param options 
     */
    constructor(selector: string, options: Options = {}) {
        super();
        
        this.form = document.querySelector(selector) as HTMLFormElement;
        
        if (!this.form) {
            SemanticValidateError.catch(
                new SemanticValidateError(`The form element with the [${selector}] doesn't exists!`)
            );
        }
        
        this.options = this.setOptions(options);
        this.schemas = new Map();
        this.isRulesBinded = {};
        this.data = {
            hash: new Map(),
            serialized: new URLSearchParams(),
        };

        if (this.options.schemas) {
            this.setSchemas(this.options.schemas);
        }
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
                throw new SemanticValidateError(`The ${name} rule already exists!`);
            }

            this.schemas.set(name, schema);
            this.setAttributes(name, schema.attributes);
        }

        return this.setup();
    }

    /**
     * 
     */
    private disableNativeValidation(): Core {
        this.options.novalidate &&
            this.form.setAttribute('novalidate', 'true');

        return this;
    }

    private setSchemaIntoElements(element: Element, schema: Schema): Core {    
        for(const [ruleAttr, value] of schema.rule) {
              if (getType(value) === 'function') continue;
            element.setAttribute(ruleAttr, value as string);
        }

        return this;
    }

    private elementsToArray(element: Node | RadioNodeList): Node[] {
        return (element instanceof RadioNodeList)
            ? Array.from(element)
            : [element];
    }

    private bindSchemaWithElementsOnce(name: string) {
        // TODO: verify if is important to check the element and throw an error
        if (!this.isRulesBinded[name]) {
            this.isRulesBinded[name] = true;

            const elementName = name as keyof typeof this.form.elements;
            const element = this.form.elements[elementName];
            const elements = this.elementsToArray(element as Element) as Array<Element>;
            const schema = this.schemas.get(name) as Schema;
            elements.forEach((element) => this.setSchemaIntoElements(element, schema));
        }

        return this;
    }

    private setEvents(): Core {
        const onInput = (event: Event) => {
            // const rule = this.rules.get(event.target.name);
            // const pattern = rule.get('pattern');
            const target = event.target as HTMLInputElement;

            this.bindSchemaWithElementsOnce(target.name);
            
            // if (typeof pattern === 'function') {
            //     if (!pattern(event.target.value)) {
            //         // TODO: emit input:error
            //         // return this.emit('field:error', {});
            //     }
            // }

            // if (Fields[event.target.localName]) {
            //     const constraint = this.transformConstraint(
            //         event.target.getAttribute('name'),
            //         event.target.validity,
            //     );

            //     // console.log(constraint);
                
            // }
        };

        this.form.removeEventListener('input', onInput);
        this.form.addEventListener('input', onInput);

        const onSumit = (event: SubmitEvent) => {
            event.preventDefault();

            for (const [name] of this.schemas) {
                this.bindSchemaWithElementsOnce(name);
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

    private transformConstraint(name: string, validityState: ValidityState) {
        const constraintErrors = [
            'badInput',
            'customError',
            'patternMismatch',
            'rangeOverflow',
            'rangeUnderflow',
            'stepMismatch',
            'tooLong',
            'tooShort',
            'typeMismatch',
            'valid',
            'valueMissing',
        ];

        const adapterConstraint = {
            'badInput': 'type',
            'customError': 'customError',
            'patternMismatch': 'pattern',
            'rangeOverflow': 'max',
            'rangeUnderflow': 'min',
            'stepMismatch': 'step',
            'tooLong': 'maxlength',
            'tooShort': 'minlength',
            'typeMismatch': 'type',
            'valid': 'valid',
            'valueMissing': 'required',
        }

        for (const constraint of constraintErrors) {
            if (validityState[constraint as keyof typeof validityState]) {
                return [adapterConstraint[constraint as keyof typeof validityState], name]; 
            }
        }        
    }

    private sanitize(value: FormDataEntryValue) {
        return String(this.options.sanitize?.(value as string));
    }

    protected getData() {

        const transformSelectMultipleValue = ([name, value]: [string, SchemaAttributeValue]) => {
            const schema = this.schemas.get(name) as Schema;
            const elementName = name as keyof typeof this.form.elements;
             
            // TODO: remember why this validation
            if (schema.rule.size === 0) {
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

    private setAttributes(name: string, attributes: SchemaAttributes) {
        const elementName = name as keyof typeof this.form.elements;
        const element = this.form.elements[elementName] as Element;

        if (attributes.size !== 0) {
            for (const [attr, value] of attributes) {
                element.setAttribute(attr, value as string);

                if (attr === 'multiple') {
                    const option = element.querySelector('option');
                    
                    if (option) {
                        option.selected = false;
                    } 
                }
            }
        }
        
        return this;
    }

    private setup(): Core {
        try {
            this
                .disableNativeValidation()
                .setEvents();
        } catch(error) {
            CustomError.catch(error);
        }

        return this;
    }
}