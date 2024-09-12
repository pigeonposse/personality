import { build }         from '@backan/builder'
import { createRequire } from 'module'
import {
	resolve as resolvePath,
	join, 
} from 'node:path'

import { distPath } from './rsbuild.config.js'

const run = async () => {

	const require = createRequire( import.meta.url )
	const pkg     = require( './package.json' )

	await build( {
		input : resolvePath( join( distPath, 'cli' ) ),
		name  : pkg.extra.id, 
	} )

} 
run()
