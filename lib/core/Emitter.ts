import SemanticValidateError from "./CustomError";

export default class Emitter {
    listeners: {};

    constructor() {
        this.listeners = {};
    }

    public on(event: string, fn: (...args: any) => void) {
        if (!this.listeners) {
            this.listeners = {};
        }

        if (!this.listeners[event]) {
            return this.listeners[event] = [fn];
        }

        this.listeners[event] = [...this.listeners[event], fn];

        return this;
    } 

    public off(event: string, fn: (...args: any) => void) {
        if (!this.listeners) {
            this.listeners = {};
        }

        if (!this.listeners[event]) {
            throw new SemanticValidateError(`The event [${event}]' doesn't exists!`);
        }

        const listener = this.listeners[event].find(listener => listener === fn);

        if (!listener) {
            throw new SemanticValidateError(`The listener in specific doesn't exists!`)
        }

        this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);

        return this;
    }

    public emit<T extends Array<unknown>>(event: string, ...args: T) {
        if (!this.listeners) {
            this.listeners = {};
        }

        if (!this.listeners[event]) {
            throw new SemanticValidateError(`The event [${event}]' doesn't exists!`);
        }

        this.listeners[event].forEach(listener => listener(...args));

        return this;
    }
};
