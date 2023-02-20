import './styles/index.scss';

import { Schema, SemanticValidate } from './core';
import { Options, TypeOptions } from './types/types';

export const schema = (value?: string, options?: TypeOptions): Schema => new Schema(value, options);
export const createValidation = (selector: string, options: Options) => new SemanticValidate(selector, options);

export { SemanticValidate as default } from './core';
