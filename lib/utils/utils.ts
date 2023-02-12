export const pipe = (...fns: Array<(v: any) => any>) => (v: any) =>
    fns.reduce((acc, fn) => fn(acc), v);

export const getType = (value: unknown): string => Object.prototype
    .toString.call(value)
    .replace(/^\[object\s|\]$/ig, '')
    .toLowerCase();