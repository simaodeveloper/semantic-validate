import SemanticValidateError from "./CustomError";

type Listeners = ((...args: any) => void)[];

export default class Emitter {
    listeners: Map<string, Listeners>;

    constructor() {
        this.listeners = new Map<string, Listeners>();
    }

    public on(event: string, fn: (...args: any) => void) {
        if (!this.listeners.get(event)) {
            return this.listeners.set(event, [fn]);
        }

        const listeners = this.listeners.get(event) as Listeners;
        const newListeners = [...listeners, fn];

        this.listeners.delete(event);
        this.listeners.set(event, newListeners);

        return this;
    } 

    public off(event: string, fn: (...args: any) => void) {
        if (!this.listeners.get(event)) {
            throw new SemanticValidateError(`The event [${event}]' doesn't exists!`);
        }

        const listeners = this.listeners.get(event) as Listeners;
        const listener = listeners.find(listener => listener === fn);

        if (!listener) {
            throw new SemanticValidateError(`The listener in specific doesn't exists!`)
        }

        const newListeners = listeners.filter(listener => listener !== fn);
        this.listeners.set(event, newListeners);

        return this;
    }

    public emit<T extends Array<unknown>>(event: string, ...args: T) {
        if (!this.listeners.get(event)) {
            throw new SemanticValidateError(`The event [${event}]' doesn't exists!`);
        }

        const listeners = this.listeners.get(event) as Listeners;
        listeners.forEach(listener => listener(...args));

        return this;
    }
};
