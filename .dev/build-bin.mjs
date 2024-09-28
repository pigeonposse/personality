import { build } from 'binarium'

import {
	cliDistPath,
	getPkg, 
} from './core.mjs'

const run = async () => {

	const pkg = await getPkg()

	await build( {
		input : cliDistPath,
		name  : pkg.extra.id, 
	} )

} 
run()
