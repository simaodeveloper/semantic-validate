import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: "json" };

console.log(pkg);


const isProd = () => process.env.BUILD === 'production';
const createUMDName = (name: string) => name
    .split('-')
    .map(v => v.replace(/^(.)/ig, m => m.toUpperCase()))
    .join('');

const plugins = [
    esbuild({
        sourceMap: !isProd(),
        minify: isProd(),
    }),
    commonjs(),
];

export default [
    {
        plugins,
        input: 'lib/index.ts',
        external: ['dompurify'],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: !isProd(),
                exports: 'named',
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: !isProd(),
                exports: 'named',
            },
            {
                file: pkg.browser,
                format: 'umd',
                name: createUMDName(pkg.name),
                sourcemap: !isProd(),
                exports: 'named',
            }
        ]
    },
    {
        plugins: [dts()],
        input: 'lib/index.ts',
        output: [
            {
                file: pkg.types,
                format: 'es',
            }
        ]
    },
];
