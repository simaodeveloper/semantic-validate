import { Schema } from "../core";

export type Options = {
    sanitize?: (value: string) => string;
    serialized?: boolean;
    novalidate?: boolean;
    schemas?: SchemaRules;
    messages?: Messages;
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

export type SchemaAttributes = Map<string, SchemaAttributeValue>;


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

export type Messages = {
    defaults: {
        [rule: string]: string;
    };
    schemas: {
        [name: string]: {
            [rule: string]: string;
        };
    };
};

export type Field =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

export type Dictionary<T> = {
    [key: string]: T
}