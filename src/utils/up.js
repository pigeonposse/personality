import updateNotifier from 'update-notifier'

import {
	version,
	name,
} from './pkg.js'

export const updater = updateNotifier( {

	pkg : {
		version,
		name,
	}, 
} )

