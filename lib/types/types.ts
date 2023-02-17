import { Schema } from "../core";

declare global {
    interface WeakRef<T extends object> {
        readonly [Symbol.toStringTag]: "WeakRef";
    
        /**
         * Returns the WeakRef instance's target object, or undefined if the target object has been
         * reclaimed.
         */
        deref(): T | undefined;
    }
    
    interface WeakRefConstructor {
        readonly prototype: WeakRef<any>;
    
        /**
         * Creates a WeakRef instance for the given target object.
         * @param target The target object for the WeakRef instance.
         */
        new<T extends object>(target: T): WeakRef<T>;
    }
}

declare var WeakRef: WeakRefConstructor;

export type Options = {
    sanitize?: (value: string) => string;
    serialized?: boolean;
    novalidate?: boolean;
    schemas?: SchemaRules;
};

export type Form = WeakRef<HTMLFormElement>;

export type Type = 
    | 'button' 
    | 'checkbox' 
    | 'color' 
    | 'date' 
    | 'datetime-local' 
    | 'email' 
    | 'file' 
    | 'hidden' 
    | 'image' 
    | 'month' 
    | 'number' 
    | 'password' 
    | 'radio' 
    | 'range' 
    | 'reset' 
    | 'search' 
    | 'submit' 
    | 'tel' 
    | 'text' 
    | 'time' 
    | 'url' 
    | 'week'
    | 'textarea'
    | 'select';

export type Pattern = string | ((value: string) => boolean);

export type SchemaRuleValue = string | number | boolean | ((value: string) => boolean);

export type SchemaAttributeValue = string | number | boolean;

export type SchemaAttributes =  Map<string, SchemaAttributeValue>;


export type TypeOptions = {
    [attribute: string]: string | number | boolean
};

export type SchemaRules = {
    [name: string]: Schema;
}

export type SubmitResult = {
    valid: boolean;
    values: {
        [key: string]: string | string[];
    },
    serialized?: string;
};

export type FieldPropValue = string | number | boolean | ((value: string) => boolean);