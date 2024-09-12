import { defineConfig } from "@rsbuild/core";


export default defineConfig({
    source: {
      entry: {
        cli: './src/cli.js',
      },
    },
    output: {
        distPath: {
            root: 'build',
        },
        target: 'node',
        filename: {
            js: '[name].cjs',
        }
    },
})