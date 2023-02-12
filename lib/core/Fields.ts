import { InputAttributes } from "../enums";
import { FieldsPropValue } from "../types/types";

export default class Fields<T, P, V extends FieldsPropValue> {
    constraint: {
        hasAttribute: boolean;
        valueIsCorrectly: boolean;
    };

    type: T;
    prop: P;
    value: V;

    constructor(type: T, prop: P, value: V) {
        this.type = type; 
        this.prop = prop; 
        this.value = value; 

        this.constraint = {
            hasAttribute: false,
            valueIsCorrectly: false,
        };

        if (InputAttributes[type as string][prop]) {
            this.constraint.hasAttribute = true;
            this.constraint.valueIsCorrectly = true;
        }
    }

    static validate<T, P, V extends FieldsPropValue>(type: T, prop: P, value: V) {
        return new Fields(type, prop, value)[type as string]();
    }

    checkbox() {}
    color() {}
    date() {}
    ['datetime-local']() {}
    email() {}
    file() {}
    hidden() {}
    image() {}
    month() {}
    number() {}
    password() {}
    radio() {}
    range() {}
    reset() {}
    search() {}
    tel() {}
    text() {}
    time() {}
    url() {}
    
    week() {
        // type week implements ISO_8601 format - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
        const isWeekFormat = (value: string): boolean => /\d{4}-W{2}/ig.test(value);

        const validations = {
            min: isWeekFormat,
            max: isWeekFormat,
        };

        if (validations[this.prop as string]) {
            this.constraint.valueIsCorrectly = validations[this.prop as string](this.value);
        }

        return this;
    }

    textarea() {}
    select() {}

}