import { Schema, SemanticValidate } from './core';
import { Options } from './types/types';

// @ts-ignore: typescript don't manage spread operator in new 
export const schema = (...args): Schema => new Schema(...args);

export const createValidation = (selector: string, options: Options) => new SemanticValidate(selector, options);

export { SemanticValidate as default } from './core';
