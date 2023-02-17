export default class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SemanticValidateError';
    }

    static catch(error: unknown) {
        console.error(error)
    }
}