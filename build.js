import { build } from '@backan/builder'

import {
	appID,
	resolvePath, 
} from './bin/utils.js'

build( {
	input : resolvePath( 'bin/cli.js' ),
	name  : appID, 
} )
