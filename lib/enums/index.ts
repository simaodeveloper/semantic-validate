export enum Fields {
    button='button',
    input='input',
    textarea='textarea',
    select='select',
}

export enum ButtonAttributes {
    disabled,
    form,
    name,
    type,
    value,
}

export enum CheckboxAttributes {
    checked,
    disabled,
    form,
    name,
    required,
    type,
    value,
}

export enum ColorAttributes {
    autocomplete,
    disabled,
    form,
    list,
    name,
    type,
    value,
}

export enum DateAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    readonly,
    required,
    step,
    type,
    value,
}

export enum DatetimeLocalAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    readonly,
    required,
    step,
    type,
    value,
}

export enum EmailAttributes {
    autocomplete,
    disabled,
    form,
    list,
    maxlength,
    minlength,
    multiple,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum FileAttributes {
    accept,
    capture,
    disabled,
    form,
    list,
    multiple,
    name,
    readonly,
    required,
    type,
    value,
}

export enum HiddenAttributes {
    autocomplete,
    disabled,
    form,
    name,
    type,
    value,
}

export enum MonthAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    readonly,
    required,
    step,
    type,
    value,
}

export enum NumberAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    placeholder,
    readonly,
    required,
    step,
    type,
    value,
}

export enum PasswordAttributes {
    autocomplete,
    disabled,
    form,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum RadioAttributes {
    checked,
    disabled,
    form,
    name,
    readonly,
    required,
    type,
    value,
}

export enum RangeAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    step,
    type,
    value,
}

export enum ResetAttributes {
    autocomplete,
    disabled,
    form,
    list,
    name,
    readonly,
    required,
    type,
    value,
}

export enum SearchAttributes {
    autocomplete,
    dirname,
    disabled,
    form,
    list,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum ImageAttributes {
    alt,
    autocomplete,
    disabled,
    form,
    formaction,
    formenctype,
    formmethod,
    formnovalidate,
    formtarget,
    height,
    list,
    name,
    readonly,
    required,
    src,
    type,
    width,
}

export enum SubmitAttributes {
    disabled,
    form,
    formaction,
    formenctype,
    formmethod,
    formnovalidate,
    formtarget,
    list,
    name,
    required,
    type,
    value,
}

export enum TelAttributes {
    autocomplete,
    disabled,
    form,
    list,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum TextAttributes {
    autocomplete,
    dirname,
    disabled,
    form,
    list,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum TimeAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    readonly,
    required,
    step,
    type,
    value,
}

export enum UrlAttributes {
    autocomplete,
    disabled,
    form,
    list,
    maxlength,
    minlength,
    name,
    pattern,
    placeholder,
    readonly,
    required,
    size,
    type,
    value,
}

export enum WeekAttributes {
    autocomplete,
    disabled,
    form,
    list,
    max,
    min,
    name,
    readonly,
    required,
    step,
    type,
    value,
}

export const InputAttributes = {
    button: ButtonAttributes,
    checkbox: CheckboxAttributes,
    color: ColorAttributes,
    date: DateAttributes,
    'datetime-local': DatetimeLocalAttributes,
    email: EmailAttributes,
    file: FileAttributes,
    hidden: HiddenAttributes,
    month: MonthAttributes,
    number: NumberAttributes,
    password: PasswordAttributes,
    radio: RadioAttributes,
    range: RangeAttributes,
    reset: ResetAttributes,
    search: SearchAttributes,
    image: ImageAttributes,
    submit: SubmitAttributes,
    tel: TelAttributes,
    text: TextAttributes,
    time: TimeAttributes,
    url: UrlAttributes,
    week: WeekAttributes,
};
