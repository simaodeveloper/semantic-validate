import Core from "./Core";
import CustomError from "./CustomError";
import {  Options, SchemaRules } from "../types/types";

export default class SemanticValidate extends Core {
    /**
     * 
     * @param form 
     * @param options 
     */
    constructor(form: string, options?: Options) {
        super(form, options);
    }

    /**
     * Add rules for de fields
     * @param rules 
     * @returns SemanticValidate instance
     */
    public addSchema(schema: SchemaRules) {
        try {
            super.setSchemas(schema);
        } catch(error) {
            CustomError.catch(error);
        }

        return this;
    }
}
