export type Options = {
    sanitize?: boolean;
    serialized?: boolean;
};

export type Form = WeakRef<HTMLFormElement>;

export type Lang = string;

export type Types = 
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

export type Rule = {
    name: string;
    type?: Types;
    minlength?: number;
    maxlength?: number;
    required?: boolean;
    multiple?: boolean;
};

export type Message = {};

export type Schema = {
    lang?: string;
    rules?: Rule[];
    messages?: Message[];
};