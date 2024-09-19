import { defineConfig } from '@rsbuild/core'

import {
	distPathOnly,
	cliSrcPath, 
} from './core.mjs'

export const distPath = 'build/in'

export default defineConfig( {
	source : { entry: { cli: cliSrcPath } },
	output : {
		distPath : { root: distPathOnly },
		target   : 'node',
		filename : { js: '[name].cjs' },
	},
} )
