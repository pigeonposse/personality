import { build } from '@backan/builder'

import {
	appID,
	resolvePath, 
} from './src/utils/main.js'

build( {
	input : resolvePath( 'bin/cli.js' ),
	name  : appID, 
} )
