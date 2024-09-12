import { build }                  from '@backan/builder'
import { createRequire }          from 'module'
import { resolve as resolvePath } from 'node:path'


const require = createRequire( import.meta.url )
const pkg     = require( './package.json' )

const run = async () => {


	// await build( {
	// 	input : resolvePath( './build/cli.cjs' ),
	// 	name  : pkg.extra.id, 
	// } )

} 
run()
