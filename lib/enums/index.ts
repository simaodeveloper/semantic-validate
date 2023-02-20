export enum Fields {
    button='button',
    input='input',
    textarea='textarea',
    select='select',
}

export enum FieldStatus {
    BADINPUT='badInput',
    CUSTOMERROR='customError',
    PATTERNMISMATCH='patternMismatch',
    RANGEOVERFLOW='rangeOverflow',
    RANGEUNDERFLOW='rangeUnderflow',
    STEPMISMATCH='stepMismatch',
    TOOLONG='tooLong',
    TOOSHORT='tooShort',
    TYPEMISMATCH='typeMismatch',
    VALID='valid',
    VALUEMISSING='valueMissing',
}

export const AdapterConstraint = {
    [FieldStatus.BADINPUT]: 'type',
    [FieldStatus.CUSTOMERROR]: 'customError',
    [FieldStatus.PATTERNMISMATCH]: 'pattern',
    [FieldStatus.RANGEOVERFLOW]: 'max',
    [FieldStatus.RANGEUNDERFLOW]: 'min',
    [FieldStatus.STEPMISMATCH]: 'step',
    [FieldStatus.TOOLONG]: 'maxlength',
    [FieldStatus.TOOSHORT]: 'minlength',
    [FieldStatus.TYPEMISMATCH]: 'type',
    [FieldStatus.VALID]: 'valid',
    [FieldStatus.VALUEMISSING]: 'required',
};
