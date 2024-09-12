/**
 * Vite config.
 *
 * @description Vite config.
 * @see https://vitejs.dev/guide
 */
import { defineConfig } from 'vite'

const target = 'node20'

export default defineConfig( {
	esbuild : {
		platform : 'node',
		target,
	},
	build : {
		ssr       : true, 
		target,
		sourcemap : false,
		lib       : {
			entry   : [ 'src/main', 'src/cli' ],
			formats : [ 'es' ],
		},
	},
} )
