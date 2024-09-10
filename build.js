import { build } from '@backan/builder'

import {
	appID,
	resolvePath, 
} from './bin/utils/main.js'

build( {
	input : resolvePath( 'bin/cli.js' ),
	name  : appID, 
} )
