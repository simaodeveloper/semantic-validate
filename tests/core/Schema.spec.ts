import { Schema } from "../../lib/core";

describe('Schema Class', () => {
    it('should create a type text required schema', () => {
        const schema = new Schema('text').required();

        expect(schema.rule.get('type')).toEqual('text');
        expect(schema.rule.get('required')).toBeTruthy();
    });
});