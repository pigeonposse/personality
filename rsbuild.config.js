import { defineConfig } from '@rsbuild/core'

export const distPath = 'build/in'

export default defineConfig( {
	source : { entry: { cli: './src/cli.js' } },
	output : {
		distPath : { root: distPath },
		target   : 'node',
		filename : { js: '[name].cjs' },
	},
} )
